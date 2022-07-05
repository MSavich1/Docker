import React from 'react';
import { DropzoneComponent } from 'react-dropzone-component';
import { DropzoneComponentConfig, DropzoneComponentHandlers } from 'react-dropzone-component/typescript/types';

import { apiFetcher } from '@alfa-bank/corp-onboarding-ui-shared-lib/utils/api-fetcher';

import { MOBILE_MEDIA_QUERY } from '@lib/constants/common';
import { UPLOAD_ALLOWED_MIME_TYPES, EXTENSION_LIST } from '@lib/constants/files';
import { DOCUMENT_VIEWS } from '@lib/constants/documents-for-uploading';
import { concatErrorsMessages } from '@lib/utils/errors';
import { getFileExtension } from '@lib/utils/strings/get-file-extension';

import { DropzoneHeading } from './dropzone-heading';
import { DropzoneLoading } from './dropzone-loading';
import { SelectFileButton } from './select-file-button';
import { DropzoneDragHover } from './dropzone-drag-hover';

import { getPreviewTemplate } from './preview-template';
import { getCopyLabel, getOriginalLabel } from './document-view-labels';
import { Props } from './props';
import { State } from './state';

import './styles/dropzone.css';
import styles from './styles/upload-documents-item.module.css';

const getLabel = {
    copy: getCopyLabel,
    original: getOriginalLabel,
};

export class UploadDocumentItem extends React.Component<Props, State> {
    djsConfig: any;

    eventHandlers: DropzoneComponentHandlers;

    componentConfig: DropzoneComponentConfig;

    static defaultProps = {
        title: '',
        hint: '',
        note: '',
        disabled: false,
        addRemoveLinks: false,
        maxDocumentSize: 20,
        maxThumbnailDocumentSize: 20,
        parallelUploads: 2,
        timeout: 30000 * 10, // in ms
        initialFiles: [],
        options: {
            fileIdUrlTemplate: '{fileId}',
            responseFileIdKey: 'key',
        },
        buttonText: 'Прикрепить файл',
        loading: false,
        hasCloser: false,
        showExtensionList: true,
        onSuccess: () => {},
        onError: () => {},
        onDocumentAdded: () => {},
        onDocumentRemoved: () => {},
        onQueueComplete: () => {},
    };

    state: State = {
        dropzone: {},
        dropzoneInitialized: false,
        documentView: undefined,
    };

    formatIcons = {
        doc: 'doc',
        ppt: 'ppt',
        txt: 'txt',
        xml: 'xml',
        png: 'png',
        pdf: 'pdf',
        zip: 'zip',
        rar: 'rar',
        jpg: 'jpg',
        jpeg: 'jpg',
        tiff: 'tif',
        tif: 'tif',
        def: 'default',
    };

    constructor(props: Props) {
        super(props);

        this.djsConfig = {
            previewTemplate: getPreviewTemplate(props.addRemoveLinks),
            previewsContainer: `[data-dz-id=${props.dzId}] .dropzone-previews`,
            acceptedFiles: UPLOAD_ALLOWED_MIME_TYPES.join(','),
            accept: (file, done) => {
                let error;

                if (file.size === 0) {
                    error = 'Файл не может быть пустым';
                }

                return done(error);
            },
            createImageThumbnails: false,
            maxFiles: null,
            maxFilesize: props.maxDocumentSize,
            maxThumbnailFilesize: props.maxThumbnailDocumentSize,
            parallelUploads: props.parallelUploads,
            dictRemoveFile: '',
            dictCancelUpload: '',
            dictFileTooBig: `Превышен допустимый размер в ${props.maxDocumentSize}MB`,
            dictInvalidFileType: 'Тип файла не поддерживается',
            dictMaxFilesExceeded: 'Превышено максимальное количество загружаемых файлов',
            hiddenInputContainer: `[data-for='${props.dzId}_${props.categoryCode}']`,
            renameFile: (file) => (window as any).encodeURIComponent(file.name),
            timeout: props.timeout,
            clickable: [`[data-for=attach-file-${props.dzId}]`],
            ...props.djsConfig,
        };

        this.componentConfig = {
            showFiletypeIcon: false,
            postUrl: props.uploadUrl,
        };

        this.eventHandlers = {
            init: (dropzone) => this.setState({ dropzone, dropzoneInitialized: true }),
            success: this.handleSuccess,
            error: this.handleError,
            queuecomplete: props.onQueueComplete,
            addedfile: this.handleAddedFile,
            removedfile: props.onDocumentRemoved,
            drop: (e: DragEvent) => {
                if ((this.props.documentViews || []).length > 1) {
                    const dropzone = e.target as HTMLElement;
                    const dropPointX = e.offsetX;
                    const dropzoneWidth = dropzone.offsetWidth;
                    const documentView = dropzoneWidth / dropPointX >= 2
                        ? DOCUMENT_VIEWS.original
                        : DOCUMENT_VIEWS.copy;

                    this.setState({ documentView });
                }
            },
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { documentViews } = props;
        const { documentView } = state;

        const isNeedUpdate = documentView === undefined &&
            documentViews &&
            documentViews.length;

        if (isNeedUpdate) {
            return { documentView: documentViews[0] };
        }

        return null;
    }

    // Установка предупреждения в шаблон
    // eslint-disable-next-line class-methods-use-this
    setWarn(file, message) {
        if (!file) return;

        const warnElement = file.previewElement.querySelector('.dz-warn-message');

        if (!warnElement) return;

        warnElement.innerText = message;
    }

    // Вычисление и установка предупреждений в дропзоны
    setWarnsToDropzones() {
        const { dropzone: { files = [] } } = this.state;
        const { initialFiles } = this.props;

        files.forEach((file) => {
            const warn = initialFiles.find((item) => item.id === file.id)?.warn;
            if (warn) {
                this.setWarn(file, warn);
            }
        });
    }

    setLabelsToDropzones() {
        const { dropzone: { files = [] } } = this.state;
        const { initialFiles } = this.props;

        files.forEach((dropzoneFile) => {
            const currentFile = initialFiles.find((file) => file.id === dropzoneFile.id);

            if (currentFile && currentFile.documentView) {
                const documentFormatElement = dropzoneFile.previewElement.querySelector('.document-view-container');
                documentFormatElement.innerHTML = getLabel[currentFile.documentView]();
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        const { dropzone } = this.state;

        if (prevProps.disabled !== this.props.disabled) {
            if (this.props.disabled) {
                dropzone.disable();
            } else {
                dropzone.enable();
            }
        }

        if (prevProps.initialFiles.length !== this.props.initialFiles.length) {
            setTimeout(() => {
                this.setWarnsToDropzones();
                this.setLabelsToDropzones();
            }, 0);
        }
    }

    componentDidMount() {
        const { initialFiles, loading, hideInitialFiles } = this.props;

        // Wait until dropzone initializes and then render thumbs.
        setTimeout(() => {
            const { dropzone, dropzoneInitialized } = this.state;

            if (
                dropzoneInitialized &&
                !loading &&
                Array.isArray(initialFiles) &&
                !hideInitialFiles
            ) {
                initialFiles.forEach((file) => {
                    this.renderThumb(dropzone, file.name, file.size, file.id);
                });
            }

            this.setWarnsToDropzones();
            this.setLabelsToDropzones();
        });
    }

    handleAddedFile = (file) => {
        const { onDocumentAdded } = this.props;
        const { documentView } = this.state;

        // eslint-disable-next-line no-param-reassign
        file.documentView = documentView;
        // Try to generate icon from filename.
        const icon = file.previewElement.querySelector('div.icon');

        if (icon) {
            let extension = getFileExtension(file.name || '');

            extension =
                extension && this.formatIcons[extension]
                    ? this.formatIcons[extension]
                    : this.formatIcons.def;

            icon.className += ` icon_name_format-${extension}`;
            icon.className += window.matchMedia(MOBILE_MEDIA_QUERY).matches
                ? ' icon_size_m'
                : ' icon_size_s';
        }

        if (!file.size) {
            const dzSizeElement = file.previewElement.querySelector('[data-dz-size]');

            if (dzSizeElement) {
                dzSizeElement.remove();
            }
        }

        onDocumentAdded(file);
    };

    handleError = (file, errorResponse) => {
        const { onError } = this.props;

        if (errorResponse.errors) {
            const errorMessage = file.previewElement.querySelector('.dz-error-message');
            errorMessage.innerText = concatErrorsMessages(errorResponse.errors);
        }

        const icon = file.previewElement.querySelector('div.icon');

        if (icon) {
            icon.className = icon.className.replace(
                /icon_name_format-\S+/,
                'icon_name_format-unknown icon_colored',
            );
        }

        onError(file);
    };

    handleSuccess = (file, response) => {
        const {
            options,
            downloadUrl,
            onSuccess,
            checkAuthEndpointSettings,
        } = this.props;

        const { responseFileIdKey, fileIdUrlTemplate } = options;
        const { dropzone } = this.state;

        if (response && response[responseFileIdKey]) {
            // eslint-disable-next-line no-param-reassign
            file.id = response[responseFileIdKey];
            const fullDownloadUrl = downloadUrl.replace(
                fileIdUrlTemplate,
                response[responseFileIdKey],
            );

            if (dropzone && dropzone.files) {
                const hasFile = dropzone.files.some((item) => file.id === item.id);

                if (!hasFile) {
                    dropzone.files.push(file);
                }
            }

            const link = file.previewElement.querySelector('div.dz-filename a');
            if (file && file.documentView) {
                const documentFormatElement = file.previewElement.querySelector('.document-view-container');
                documentFormatElement.innerHTML = getLabel[file.documentView]();
            }

            if (link) {
                link.addEventListener('click', (ev) => this.download(ev, fullDownloadUrl, checkAuthEndpointSettings));
            }
        }

        if (onSuccess) {
            onSuccess(file, response);
        }
    };

    download = (ev: Event, path: string, checkAuthEndpointSettings: Props['checkAuthEndpointSettings']) => {
        const { onDownloadError } = this.props;

        ev.preventDefault();
        apiFetcher
            .get(checkAuthEndpointSettings.endpointPath, {}, {
                basePath: checkAuthEndpointSettings.basePath,
            })
            .then(() => {
                window.location.assign(path);
            })
            .catch((error) => {
                onDownloadError(error, true);
            });
    };

    // Kind a weird way to render thumbs by emitting events on an underlying
    // component, but for now it's the only way to render initial thumbs in DropzoneJS.
    renderThumb = (dropzone, name, size, fileId) => {
        const {
            options: { responseFileIdKey },
        } = this.props;

        const mockFile = { name, size, id: fileId };

        dropzone.emit('addedfile', mockFile);
        dropzone.emit('success', mockFile, {
            [responseFileIdKey]: mockFile.id,
        });
        dropzone.emit('complete', mockFile);
    };

    setDocumentView = (documentView, callBack) => {
        this.setState({ documentView }, callBack);
    };

    render() {
        const {
            title,
            hint,
            disabled,
            additionalHint,
            note,
            dzId,
            categoryCode,
            number,
            loading,
            loadingText,
            hasCloser,
            onCloserClick,
            buttonText,
            showExtensionList,
            className = '',
            attachButtonContainerClassName = '',
            extensionListClassName = '',
            documentViews,
            djsConfig,
        } = this.props;

        const { documentView } = this.state;

        const extensionsList = djsConfig?.acceptedFiles ?
            `${djsConfig.acceptedFiles}`.split(',') :
            EXTENSION_LIST;

        if (loading) {
            return (
                <DropzoneLoading
                    title={ title }
                    hasCloser={ hasCloser }
                    onCloserClick={ onCloserClick }
                    dzId={ dzId }
                    categoryCode={ categoryCode }
                    loadingText={ loadingText }
                />
            );
        }

        const baseClassNames = `${styles.dropzoneWrapper} ${className}`;
        const extensionListClassNames = `${styles.extensionList} ${extensionListClassName}`;
        const attachButtonContainerClassNames = `${styles.attachButtonContainer} ${attachButtonContainerClassName}`;
        const componentConfig = {
            ...this.componentConfig,
            /** В клиентском процессе нет выбора типа документа, поэтому в запрос добавлять documentView не нужно */
            postUrl: this.componentConfig.postUrl.concat(
                documentView === undefined
                    ? ''
                    : `&documentView=${documentView}`,
            ),
        };

        return (
            <div
                className={ baseClassNames }
                data-title={ title }
                data-test-id={ `dropzone ${categoryCode}` }
                data-dz-id={ dzId }
            >
                <DropzoneComponent
                    className={ styles.dropzoneComponent }
                    config={ componentConfig }
                    djsConfig={ this.djsConfig }
                    eventHandlers={ this.eventHandlers }
                >
                    { title && (
                        <DropzoneHeading
                            hint={ hint }
                            additionalHint={ additionalHint }
                            note={ note }
                            title={ title }
                            number={ number }
                        />
                    ) }
                    <div className="dropzone-previews" />
                    <div className={ attachButtonContainerClassNames }>
                        <SelectFileButton
                            disabled={ disabled }
                            dzId={ dzId }
                            defaultButtonText={ buttonText }
                            documentViews={ documentViews }
                            setDocumentView={ this.setDocumentView }
                        />
                        {
                            showExtensionList && (
                                <span className={ extensionListClassNames }>{ extensionsList.join(', ') }</span>
                            )
                        }
                    </div>
                    <DropzoneDragHover documentViews={ documentViews } />
                </DropzoneComponent>
                <div data-for={ `${dzId}_${categoryCode}` } />
            </div>
        );
    }
}
