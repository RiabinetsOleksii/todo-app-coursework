import React, { useState } from 'react';
import {
    List, 
    Card, 
    CardContent, 
    Typography, 
    IconButton, 
    Box,
    Checkbox, 
    Chip, 
    TextField, 
    useTheme,
    ListItemIcon, 
    ListItemText as MuiListItemText, 
    ListItemButton as MuiListItemButton,
    Collapse, 
    ListItem as MuiListItem,
    LinearProgress, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem
} from '@mui/material';

// Іконки
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/CancelOutlined';

// Дата
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isPast, parseISO } from 'date-fns';

const FIXED_CATEGORIES = ['Особисте', 'Робота', 'Навчання', 'Спорт', 'Фінанси', 'Інше'];

// --- Допоміжна функція для кольорів ---
const getCategoryColor = (category, theme) => {
    const categoryColors = theme.palette.category || {};
    let colorKey = 'other';
    
    switch (category) {
        case 'Робота': colorKey = 'work'; break;
        case 'Навчання': colorKey = 'study'; break;
        case 'Спорт': colorKey = 'sport'; break;
        case 'Фінанси': colorKey = 'finance'; break;
        case 'Особисте': colorKey = 'personal'; break;
        default: colorKey = 'other';
    }
    
    const mainColor = categoryColors[colorKey] || theme.palette.grey[500];
    return { 
        bgColor: mainColor + '20', 
        color: mainColor 
    };
};

// --- Компонент Списку Підзадач ---
const SubtaskList = ({ subtasks, todoId, toggleSubtaskComplete }) => {
    const [open, setOpen] = useState(false);
    const safeSubtasks = subtasks || [];
    const completedCount = safeSubtasks.filter(st => st.completed).length;
    const totalCount = safeSubtasks.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <Box sx={{ mt: 2, width: '100%' }}>
            <MuiListItemButton onClick={() => setOpen(!open)} sx={{ p: 0, py: 0.5, '&:hover': { bgcolor: 'transparent' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                     <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mr: 1, minWidth: 'fit-content' }}>
                        {totalCount > 0 ? `${completedCount}/${totalCount}` : ''}
                    </Typography>
                     <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: 6, borderRadius: 3, mr: 1 }} />
                    {open ? <ExpandLess fontSize="small" color="action" /> : <ExpandMore fontSize="small" color="action" />}
                </Box>
            </MuiListItemButton>
            
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <List component="div" disablePadding dense sx={{ width: '100%', mt: 1, bgcolor: 'action.hover', borderRadius: 1, maxHeight: '150px', overflowY: 'auto' }}>
                    {safeSubtasks.map((subtask) => (
                        <MuiListItem key={subtask.id} disablePadding>
                             <MuiListItemButton onClick={() => toggleSubtaskComplete(todoId, subtask.id, subtask.completed)} sx={{ pl: 1, py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    {subtask.completed ? <CheckBoxIcon color="primary" fontSize="small" /> : <CheckBoxOutlineBlankIcon fontSize="small" />}
                                </ListItemIcon>
                                <MuiListItemText primary={subtask.title} primaryTypographyProps={{ variant: 'body2', style: { textDecoration: subtask.completed ? 'line-through' : 'none', color: subtask.completed ? 'text.secondary' : 'text.primary' } }} />
                             </MuiListItemButton>
                        </MuiListItem>
                    ))}
                </List>
            </Collapse>
        </Box>
    );
};

// --- Компонент Окремої Задачі (Картка) ---
const TodoItem = ({ todo, deleteTodo, toggleComplete, updateTodo, toggleSubtaskComplete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: todo.title,
        description: todo.description,
        category: todo.category,
        dueDate: todo.dueDate ? parseISO(todo.dueDate) : null,
        important: todo.important,
    });
    const theme = useTheme();

    const dueDate = todo.dueDate ? parseISO(todo.dueDate) : null;
    const deadlineText = dueDate ? format(dueDate, 'dd.MM.yyyy') : null;
    const isOverdue = dueDate && isPast(dueDate) && !todo.completed;
    const categoryStyles = getCategoryColor(todo.category, theme);

    const startEdit = () => {
        setEditData({
            title: todo.title, description: todo.description, category: todo.category,
            dueDate: todo.dueDate ? parseISO(todo.dueDate) : null, important: todo.important,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!editData.title.trim()) return;
        const formattedDueDate = editData.dueDate ? format(editData.dueDate, 'yyyy-MM-dd') : null;
        updateTodo(todo.id, { ...editData, dueDate: formattedDueDate, completed: todo.completed, type: todo.type });
        setIsEditing(false);
    };

    const handleImportantToggle = () => {
        if (isEditing) { setEditData({ ...editData, important: !editData.important }); } 
        else { updateTodo(todo.id, { ...todo, important: !todo.important }); }
    };

    return (
        <Card
            elevation={todo.completed ? 1 : 3}
            sx={{
                display: 'flex', flexDirection: 'column',
                opacity: todo.completed ? 0.8 : 1,
                backgroundColor: todo.completed ? theme.palette.action.hover : theme.palette.background.paper,
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: todo.completed ? 'transparent' : (todo.important ? theme.palette.error.light : 'divider'),
                // ЗМІНА: Прибрали position: relative і overflow: visible, бо зірочка більше не "плаває"
                '&:hover': { boxShadow: theme.shadows[6], borderColor: todo.important ? theme.palette.error.main : theme.palette.primary.main, transform: 'translateY(-2px)' },
            }}
        >
            {/* ЗМІНА: ЗІРОЧКУ ЗВІДСИ ПРИБРАНО */}

            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    
                    {/* Чекбокс */}
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                        <Checkbox checked={todo.completed} onChange={() => toggleComplete(todo.id)} color="success" icon={<CheckBoxOutlineBlankIcon fontSize="medium" />} checkedIcon={<CheckBoxIcon fontSize="medium" />} disabled={isEditing} />
                    </Box>

                    {/* Контент */}
                    <Box sx={{ flexGrow: 1, mr: 2 }}> {/* Зменшили mr з 4 до 2, бо зірочка не заважає */}
                        <Box sx={{ mb: 0.5 }}>
                            {isEditing ? (
                                <TextField fullWidth variant="standard" placeholder="Заголовок" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} autoFocus />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 600, textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer', lineHeight: 1.3, fontSize: '1.1rem' }} onDoubleClick={startEdit}>
                                    {todo.title}
                                </Typography>
                            )}
                        </Box>
                        
                        {(todo.description || isEditing) && (
                            <Box sx={{ mb: 1 }}>
                                {isEditing ? (
                                    <TextField fullWidth multiline rows={2} variant="standard" placeholder="Опис" value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }} onDoubleClick={startEdit}>
                                        {todo.description}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                            {isEditing ? (
                                <>
                                    <FormControl size="small" variant="standard" sx={{ minWidth: 100 }}>
                                        <InputLabel>Категорія</InputLabel>
                                        <Select value={editData.category || ''} onChange={(e) => setEditData({ ...editData, category: e.target.value })}>
                                            <MenuItem value=""><em>Немає</em></MenuItem>
                                            {FIXED_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker value={editData.dueDate} onChange={date => setEditData({ ...editData, dueDate: date })} slotProps={{ textField: { variant: 'standard', size: 'small', sx: { width: 120 } } }} />
                                    </LocalizationProvider>
                                </>
                            ) : (
                                <>
                                    {todo.category && <Chip label={todo.category} size="small" sx={{ bgcolor: categoryStyles.bgColor, color: categoryStyles.color, fontWeight: 600, borderRadius: 1, height: 24, fontSize: '0.75rem' }} />}
                                    {deadlineText && <Chip icon={isOverdue ? <CancelIcon fontSize='small'/> : null} label={deadlineText} size="small" variant="outlined" color={isOverdue ? 'error' : (todo.completed ? 'success' : 'default')} sx={{ borderRadius: 1, height: 24, fontSize: '0.75rem' }} />}
                                </>
                            )}
                        </Box>

                        {todo.type === 'checklist' && todo.subtasks && (
                             <Box sx={{ mt: 1 }}>
                                <SubtaskList subtasks={todo.subtasks} todoId={todo.id} toggleSubtaskComplete={toggleSubtaskComplete} />
                            </Box>
                        )}
                    </Box>

                    {/* Кнопки дій (Справа) */}
                    {/* ЗМІНА: Зірочка тепер тут, перша в списку */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 1, alignItems: 'center' }}>
                        
                        {/* Кнопка Важливості */}
                        <IconButton 
                            onClick={handleImportantToggle} 
                            size="small"
                            sx={{ 
                                color: (isEditing ? editData.important : todo.important) ? 'error.main' : 'action.disabled',
                                opacity: (isEditing ? editData.important : todo.important) ? 1 : 0.6,
                                '&:hover': { opacity: 1, color: 'error.main' } 
                            }}
                        >
                            {(isEditing ? editData.important : todo.important) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>

                        {isEditing ? (
                            <>
                                <IconButton onClick={handleSave} color="success" size="small"> <SaveIcon fontSize="small" /> </IconButton>
                                <IconButton onClick={() => setIsEditing(false)} color="error" size="small"> <CancelIcon fontSize="small" /> </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton onClick={startEdit} color="primary" size="small" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}> <EditIcon fontSize="small" /> </IconButton>
                                <IconButton onClick={() => deleteTodo(todo.id)} color="error" size="small" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}> <DeleteIcon fontSize="small" /> </IconButton>
                            </>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// --- Головний компонент списку ---
const TodoList = ({ todos = [], deleteTodo, toggleComplete, updateTodo, toggleSubtaskComplete }) => {
    if (!todos || todos.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px dashed divider' }}>
                <Typography variant="h6" color="text.secondary">Список задач порожній</Typography>
                <Typography variant="body2" color="text.secondary">Додайте нову задачу, щоб почати.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {todos.map((todo) => (
                <Box key={todo.id} sx={{ width: '100%', mb: 2 }}>
                    <TodoItem
                        todo={todo}
                        deleteTodo={deleteTodo}
                        toggleComplete={toggleComplete}
                        updateTodo={updateTodo}
                        toggleSubtaskComplete={toggleSubtaskComplete}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default TodoList;