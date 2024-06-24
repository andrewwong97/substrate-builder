import FileViewer from 'react-file-viewer';
import '../styles/Renderer.css';

type RendererProps = {
    height: number;
    width: number;
    file?: File;
};

export default function Renderer({ height, width, file }: RendererProps) {

    const getFileExtension = (fileName: string) => {
        return fileName.split('.').pop();
    }

    if (file) {
        return (
            <div className="Renderer" style={{width, height}}>
                <FileViewer
                    fileType={getFileExtension(file?.name)}
                    filePath={URL.createObjectURL(file)}
                />
                {file.name && <p>Rendering file: {file.name}</p>}
            </div>
        );
    }
    return (
        <div className="Renderer" style={{width, height}}>
            <p>No file selected</p>
        </div>
    ); 
}