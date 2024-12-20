import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from '../AuthContext';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

const NewsletterManager = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { baseurl } = useAuth();

    // Fetch all newsletters on component mount
    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseurl}/newsletters`);
            setNewsletters(response.data);
        } catch (error) {
            setError('Error fetching newsletters.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('document', file);

        try {
            if (editId) {
                // Update newsletter
                await axios.put(`${baseurl}/newsletters/${editId}`, formData , {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setEditId(null); // Reset editId after updating
            } else {
                // Add new newsletter
                await axios.post(`${baseurl}/newsletters`, formData);
            }

            // Reset form
            setTitle('');
            setFile(null);
            fetchNewsletters(); // Refresh newsletters list
        } catch (error) {
            setError('Error submitting form.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (newsletter) => {
        setEditId(newsletter._id);
        setTitle(newsletter.title);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${baseurl}/newsletters/${id}`);
            fetchNewsletters(); // Refresh newsletters list after deletion
        } catch (error) {
            setError('Error deleting newsletter.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className='p-3'>
            
            <Typography variant="h4" gutterBottom>
                Newsletter Manager
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Newsletter Title"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" component="label">
                                Upload PDF
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    required
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {editId ? 'Update Newsletter' : 'Add Newsletter'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Typography variant="h5" gutterBottom>
                All Newsletters
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <List>
                    {newsletters.map((newsletter) => (
                        <ListItem key={newsletter._id}>
                            <ListItemText
                                primary={newsletter.title}
                                secondary={
                                    newsletter.documentLink && (
                                        <a href={newsletter.documentLink} target="_blank" rel="noopener noreferrer">
                                            View Document
                                        </a>
                                    )
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(newsletter)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(newsletter._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
        </>
    );
};

export default NewsletterManager;
