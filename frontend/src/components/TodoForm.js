import React, { useState } from 'react';
import {
    TextField, Button, Container, Box, Checkbox, FormControlLabel,
    Select, MenuItem, FormControl, InputLabel, InputAdornment, 
    ToggleButtonGroup, ToggleButton, Typography, useTheme, IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import LabelIcon from '@mui/icons-material/Label';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DoneIcon from '@mui/icons-material/Done';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close'; 
import AddIcon from '@mui/icons-material/Add'; 

const FIXED_CATEGORIES = [
    'Особисте', 'Робота', 'Навчання', 'Спорт', 'Фінанси', 'Інше',
];

const TodoForm = ({ onAdd }) => { 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [important, setImportant] = useState(false);
    const [dueDate, setDueDate] = useState(null);
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taskType, setTaskType] = useState('task');
    const [subtasks, setSubtasks] = useState(['']);
    const theme = useTheme();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        const formattedDueDate = dueDate ? format(dueDate, 'yyyy-MM-dd') : null;

        const subtasksPayload = subtasks
            .filter(st => st.trim() !== '')
            .map(title => ({ title })); 

        const newTodo = {
            title, description, completed: false, important, 
            dueDate: formattedDueDate, category: category.trim(), 
            type: taskType,
            subtasks: taskType === 'checklist' ? subtasksPayload : null, 
        };
        
        await onAdd(newTodo); 

        setTimeout(() => {
            setIsSubmitting(false);
            setTitle(''); setDescription(''); setImportant(false); setDueDate(null); setCategory('');
            setTaskType('task');
            setSubtasks(['']);
        }, 500);
    };
    
    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setTaskType(newType);
        }
    };

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
    };

    const handleSubtaskRemove = (index) => {
        const newSubtasks = subtasks.filter((_, i) => i !== index);
        setSubtasks(newSubtasks);
    };
    
    const submitButtonText = taskType === 'task' ? 'ДОДАТИ ЗАДАЧУ' : 'СТВОРИТИ СПИСОК';

    return (
        <Container component="main" maxWidth="sm" sx={{p:0}}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 0 }}>
                
                {/* 0. ВИБІР ТИПУ ЗАВДАННЯ */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={taskType}
                        exclusive
                        onChange={handleTypeChange}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="task" sx={{ borderRadius: 1 }}>
                            <TitleIcon sx={{ mr: 1 }} /> ЗАДАЧА
                        </ToggleButton>
                        <ToggleButton value="checklist" sx={{ borderRadius: 1 }}>
                            <FormatListBulletedIcon sx={{ mr: 1 }} /> СПИСОК
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
                {/* 1. Title Input */}
                <TextField 
                    margin="normal" required fullWidth label="Заголовок *" autoFocus
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    variant="outlined" 
                    InputProps={{ 
                        startAdornment: (<InputAdornment position="start"><TitleIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>),
                    }}
                />
                
                {/* 2. Description Input */}
                <TextField 
                    margin="normal" fullWidth label="Опис" multiline rows={2}
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    InputProps={{ 
                        startAdornment: (<InputAdornment position="start"><DescriptionIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>),
                    }}
                />

                {/* КОНСТРУКТОР ЧЕКЛІСТА (Тільки для Списку) */}
                {taskType === 'checklist' && (
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ddd', borderRadius: 2, bgcolor: theme.palette.background.default }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Підзадачі:
                        </Typography>
                        
                        {subtasks.map((st, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Підзадача ${index + 1}`}
                                    value={st}
                                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                    variant="outlined"
                                />
                                {subtasks.length > 1 && (
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleSubtaskRemove(index)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button 
                            startIcon={<AddIcon />} 
                            onClick={() => setSubtasks([...subtasks, ''])}
                            variant="text" 
                            size="small"
                        >
                            Додати ще підзадачу
                        </Button>
                    </Box>
                )}
                
                {/* 3. Категорія Select */}
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="category-label">Категорія</InputLabel>
                    <Select
                        labelId="category-label" value={category} label="Категорія"
                        onChange={(e) => setCategory(e.target.value)}
                        startAdornment={<InputAdornment position="start"><LabelIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>}
                    >
                        <MenuItem value=""><em>Не вибрано</em></MenuItem>
                        {FIXED_CATEGORIES.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
                    </Select>
                </FormControl>

                {/* 4. Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker 
                        label="Термін виконання (dueDate)" value={dueDate}
                        onChange={(newDate) => setDueDate(newDate)}
                        slotProps={{ 
                            textField: { 
                                fullWidth: true, margin: 'normal', 
                                variant: 'outlined', 
                                InputProps: { 
                                    startAdornment: (<InputAdornment position="start"><CalendarTodayIcon sx={{ color: theme.palette.primary.main }} /></InputAdornment>),
                                }
                            } 
                        }}
                    />
                </LocalizationProvider>
                
                {/* 5. Checkbox */}
                <FormControlLabel 
                    control={
                        <Checkbox checked={important} onChange={(e) => setImportant(e.target.checked)} color="error"
                            sx={{ '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.1s ease-out' } }}
                        />
                    }
                    label="Важлива (Important)"
                    sx={{ mt: 1 }}
                />

                {/* 6. Кнопка з Success анімацією */}
                <Button 
                    type="submit" fullWidth variant="contained" 
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                    color={isSubmitting ? 'success' : 'primary'}
                    startIcon={isSubmitting ? <DoneIcon /> : null}
                >
                    {isSubmitting ? 'Додано!' : submitButtonText}
                </Button>
            </Box>
        </Container>
    );
};

export default TodoForm;