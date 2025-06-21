export interface Point2D {
    x: number;
    y: number;
}
export const defaultPoint2D: Point2D = {
    x: 0,
    y: 0
};

export interface EditorControllerForUI {
    run: () => void;

    handleKeyDown: (e) => void;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onUIMount: (sampleSize: Point2D) => void;
}
