import ImageContainer from '../components/image/image-container';

interface Props {
    images: IImage[];
}

export default function ImageLayout({ images }: Props) {
    if (images.length === 0) return <></>;

    const imagesLength = images.length;

    if (images[0].orientation === 'horizontal') {
        if (imagesLength === 1) {
            return <ImageContainer quantity="multiple" className="aspect-video" url={images[0].url} />;
        } else if (imagesLength === 2) {
            if (images[1].orientation === 'horizontal') {
                return (
                    <div className="space-y-2">
                        {images.map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-video"
                                url={image.url}
                            />
                        ))}
                    </div>
                );
            } else {
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-square"
                                url={image.url}
                            />
                        ))}
                    </div>
                );
            }
        } else if (imagesLength === 3 || imagesLength === 4) {
            const handleColumn = () => {
                switch (imagesLength) {
                    case 3:
                        return 'grid-cols-2';
                    case 4:
                        return 'grid-cols-3';
                }
            };
            return (
                <div className="space-y-2">
                    <ImageContainer quantity="multiple" className="aspect-video" url={images[0].url} />

                    <div className={`grid ${handleColumn()} gap-2`}>
                        {images.slice(1).map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-square"
                                url={image.url}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    } else {
        if (imagesLength === 1) {
            return <ImageContainer quantity="multiple" className="aspect-9/16" url={images[0].url} />;
        } else if (imagesLength === 2) {
            if (images[1].orientation === 'vertical') {
                return (
                    <div className="grid grid-cols-2 space-x-2">
                        {images.map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-9/16"
                                url={image.url}
                            />
                        ))}
                    </div>
                );
            } else {
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-square"
                                url={image.url}
                            />
                        ))}
                    </div>
                );
            }
        } else if (imagesLength === 3 || imagesLength === 4) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <ImageContainer url={images[0].url} quantity="multiple" />
                    <div className="space-y-2">
                        {images.slice(1).map((image) => (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                url={image.url}
                                quantity="multiple"
                                className="aspect-video"
                            />
                        ))}
                    </div>
                </div>
            );
        }
    }

    if (imagesLength >= 5) {
        return (
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-x-2">
                    {images.slice(0, 2).map((image) => {
                        return (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-square"
                                url={image.url}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {images.slice(2, 5).map((image, index) => {
                        if (index === 2 && imagesLength > 5) {
                            return (
                                <div className="relative">
                                    <ImageContainer
                                        key={image.url + Date.now().toString()}
                                        moreImage={imagesLength - 5}
                                        quantity="multiple"
                                        className="aspect-square"
                                        url={image.url}
                                    />
                                </div>
                            );
                        }
                        return (
                            <ImageContainer
                                key={image.url + Date.now().toString()}
                                quantity="multiple"
                                className="aspect-square"
                                url={image.url}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    return <></>;
}
