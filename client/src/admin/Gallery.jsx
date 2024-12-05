import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Button,
    Box,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Slider,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // Custom cropping utility
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { useAuth } from '../AuthContext'; // Context for auth
import { useDropzone } from 'react-dropzone'; // Import useDropzone

const ImageUpload = () => {
    const [imageQueue, setImageQueue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageType, setImageType] = useState('Classroom');
    const [imageToDelete, setImageToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [aspectRatio, setAspectRatio] = useState(4 / 3); // Default aspect ratio
    const { baseurl } = useAuth();

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseurl}/get/images`, { withCredentials: true });
                setImages(response.data.img);
            } catch (error) {
                console.error("Error fetching images:", error);
                toast.error("Failed to fetch images.");
            }
            setLoading(false);
        };

        fetchImages();
    }, [baseurl]);

    const onDrop = useCallback((acceptedFiles) => {
        // Filter to only accept image files
        const imageFiles = acceptedFiles.filter((file) => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            toast.error("Please upload valid image files.");
            return;
        }

        const filesWithPreview = imageFiles.map((file) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            return new Promise((resolve) => {
                fileReader.onload = () => {
                    resolve({ file, preview: fileReader.result });
                };
            });
        });

        Promise.all(filesWithPreview).then((files) => {
            setImageQueue((prev) => [...prev, ...files]);
            setPreviewUrl(files[0].preview);
            // Open crop dialog only if one image is selected
            if (files.length === 1) {
                setCropDialogOpen(true);
            } else {
                handleUploadMultiple(files);
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*', // Accept only image files
    });

    const handleCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        if (imageQueue.length === 0) {
            toast.error("No images to upload.");
            return;
        }

        setLoading(true);
        const { file } = imageQueue[0];

        try {
            const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels);
            const formData = new FormData();
            formData.append('image', croppedImage);
            formData.append('type', imageType);

            const response = await axios.post(`${baseurl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            toast.success("Image uploaded successfully!");
            setImages((prev) => [...prev, response.data]);
            setImageQueue((prev) => prev.slice(1));
            setCropDialogOpen(false);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadMultiple = async (files) => {
        setLoading(true);
        const promises = files.map(async ({ file }) => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', imageType);
            try {
                const response = await axios.post(`${baseurl}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                return response.data; // Return uploaded image data
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image.");
                return null; // Return null in case of error
            }
        });

        // Wait for all uploads to complete
        const uploadedImages = await Promise.all(promises);
        // Filter out null responses
        const successfulUploads = uploadedImages.filter(image => image !== null);

        if (successfulUploads.length > 0) {
            setImages((prev) => [...prev, ...successfulUploads]);
            toast.success("Images uploaded successfully!");
        }
        setImageQueue([]); // Clear the queue after uploading
        setLoading(false);
    };

    const openDeleteDialog = (id) => {
        setImageToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.post(`${baseurl}/delete/img/${imageToDelete}`, {}, { withCredentials: true });
            setImages(images.filter(image => image._id !== imageToDelete));
            toast.success("Image deleted successfully!");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image.");
        } finally {
            setDeleteDialogOpen(false);
            setImageToDelete(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex gap-10 lg:flex-row flex-col">
                <div className='flex flex-col p-6'>
                    <Box {...getRootProps()} style={{ cursor: 'pointer', border: '2px dashed #ccc', borderRadius: '8px', padding: '20px', transition: 'background-color 0.2s' }}>
                        <input {...getInputProps()} />
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: isDragActive ? '#e0f7fa' : 'inherit' }}>
                            <Typography variant="h5" gutterBottom textAlign="center">
                                Upload Gallery Images
                            </Typography>
                            <Typography variant="body1" textAlign="center">
                                Drag and drop images here, or click to select
                            </Typography>
                            <Button variant="outlined" component="span" color="primary" fullWidth sx={{ mt: 2 }}>
                                Select Images
                            </Button>
                        </Paper>
                    </Box>

                    {/* Image Type Selection */}
                    <FormControl sx={{ minWidth: 100, padding: ".7rem",margin:'1rem 0 0 0 ' }}>
                        <InputLabel id="image-type-label">Image Type</InputLabel>
                        <Select
                            labelId="image-type-label"
                            id="image-type-select"
                            value={imageType}
                            onChange={(e) => setImageType(e.target.value)}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="Classroom">Classroom</MenuItem>
                            <MenuItem value="Team">Team</MenuItem>
                            <MenuItem value="Outing">Outing</MenuItem>
                            <MenuItem value="Students">Students</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 100, padding: ".7rem" }}>
                        <InputLabel id="aspect-ratio-label">Aspect Ratio</InputLabel>
                        <Select
                            labelId="aspect-ratio-label"
                            id="aspect-ratio-select"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value={1}>1:1</MenuItem>
                            <MenuItem value={4 / 3}>4:3</MenuItem>
                            <MenuItem value={16 / 9}>16:9</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className='grid lg:grid-cols-4 h-[calc(100vh-100px)] overflow-scroll md:grid-cols-3 grid-cols-2 py-5'>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        images.map((image) => (
                            <Card key={image._id} sx={{ width: 200, height:200, margin: 1 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={image.url}
                                    alt="Uploaded"
                                />
                                <CardContent>
                                    <IconButton className="z-50" onClick={() => openDeleteDialog(image._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)}>
                <DialogTitle>Crop Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Adjust the cropping area as needed.
                    </DialogContentText>
                    <Box sx={{ position: 'relative', height: '400px' }}>
                        <Cropper
                            image={previewUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCropDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpload}>Upload</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this image?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ImageUpload;
