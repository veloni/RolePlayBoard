import { useState, useRef, useEffect } from "react";
import { SwitcherHeader } from "../SwitcherHeader/SwitcherHeader";
import './ImagesComponent.css';

interface ImageData {
    name: string;
    url: string;
}

interface IProps {
    folders: string[];
    foldersWithImages: Record<string, ImageData[]>;
    isMonitor?: boolean,
}

const { ipcRenderer } = window.require('electron');

export const ImagesComponents = (props: IProps) => {
    const [pageState, setPageState] = useState(props.folders[0]);
    const gridRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => { 
        setPageState(props.folders[0])
    }, [props.folders])

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (!gridRef.current) return;
            
            const grid = gridRef.current;
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            
            entries.forEach(entry => {
                const rowSpan = Math.ceil((entry.contentRect.height + rowGap) / (rowHeight + rowGap));
                (entry.target as HTMLElement).style.gridRowEnd = `span ${rowSpan}`;
            });
        });

        const gridItems = gridRef.current?.querySelectorAll('.gallery-item');
        gridItems?.forEach(item => {
            resizeObserver.observe(item);
        });

        return () => {
            gridItems?.forEach(item => {
                resizeObserver.unobserve(item);
            });
        };
    }, [pageState, props.foldersWithImages]);

    const handleImageClick = (imageUrl: string) => {
        ipcRenderer.send('show-image', imageUrl);
    };

    return (
        <div className="monitor-container">
            {props.folders.length !== 0 && <SwitcherHeader 
                options={props.folders} 
                setPageState={setPageState}
                currentState={pageState}
            />}

            <div className={`images-grid ${props.isMonitor ? 'images-grid_monitor' : ''}`} ref={gridRef}>
                {props.foldersWithImages[pageState]?.map((image, index) => (
                    <div 
                        key={`${pageState}-${index}`}
                        className={`gallery-item ${props.isMonitor && hoveredIndex === index ? 'hovered' : ''}`}
                        onMouseEnter={() => props.isMonitor && setHoveredIndex(index)}
                        onMouseLeave={() => props.isMonitor && setHoveredIndex(null)}
                        onClick={() => props.isMonitor && handleImageClick(image.url)}
                    >
                        <img 
                            src={image.url} 
                            alt={image.name}
                            className="gallery-image"
                            loading="lazy"
                        />

                        {props.isMonitor && <span className="gallery-image__name">
                            {image.name.split('.')[0]}
                        </span>}
                    </div>
                ))}
            </div>
        </div>
    );
};