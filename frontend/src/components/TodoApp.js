import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm"; 
import TodoList from "./TodoList"; 
import { 
    Container, Typography, Box, CssBaseline, 
    Select, MenuItem, FormControl, InputLabel, List, ListItem,
    ListItemButton, ListItemText, Drawer, Divider, useTheme, Chip,
    Paper, IconButton, Collapse, Button
} from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import { isToday, parseISO } from 'date-fns';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import TodayIcon from '@mui/icons-material/Today';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import AddCircleIcon from '@mui/icons-material/AddCircle'; 
import CloseIcon from '@mui/icons-material/Close';

const API_URL = "http://localhost:8080/api/todos";
const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 70;

const CATEGORY_OPTIONS = [
    'Особисте', 'Робота', 'Навчання', 'Спорт', 'Фінанси', 'Інше',
];

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all'); 
    const [sortBy, setSortBy] = useState('importance');
    const theme = useTheme();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [openCategories, setOpenCategories] = useState(true);
    
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch(API_URL)
          .then(res => res.json())
          .then(data => setTodos(Array.isArray(data) ? data : [])) 
          .catch(err => console.error("Помилка завантаження задач:", err));
    }, []);

    const handleAddTodo = async (todo) => {
        await addTodo(todo); 
        setShowForm(false); 
    };

    const addTodo = async (todo) => {
        try {
            const res = await fetch(API_URL, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(todo)
            });
            const newTodo = await res.json();
            setTodos([...todos, newTodo]);
        } catch (error) { console.error("Помилка додавання:", error); }
    };

    const deleteTodo = async (id) => {
        try { await fetch(`${API_URL}/${id}`, { method: "DELETE" }); setTodos(todos.filter(t => t.id !== id));
        } catch (error) { console.error("Помилка видалення:", error); }
    };

    const toggleComplete = async (id) => {
        try {
            const todo = todos.find(t => t.id === id);
            if (!todo) return;

            const newCompletedState = !todo.completed;
            let updatedSubtasks = todo.subtasks;

            if (todo.type === 'checklist' && newCompletedState === true) {
                updatedSubtasks = todo.subtasks.map(st => ({ ...st, completed: true }));
            }

            const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PUT" });
            const updated = await res.json(); 

            setTodos(todos.map(t => (t.id === id ? { ...updated, subtasks: updatedSubtasks } : t)));
            
        } catch (error) { console.error("Помилка зміни статусу:", error); }
    };

    const updateTodo = async (id, updatedFields) => {
        const todoToUpdate = todos.find(todo => todo.id === id);
        if (!todoToUpdate) return;
        
        const updatedTodo = { ...todoToUpdate, ...updatedFields, };

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedTodo)
            });
            const updatedData = await res.json();
            setTodos(todos.map(t => (t.id === id ? updatedData : t)));
        } catch (error) { console.error("Помилка оновлення задачі:", error); }
    };
    
    const toggleSubtaskComplete = (todoId, subtaskId, isCompleted) => {
        const updatedTodos = todos.map(todo => {
            if (todo.id === todoId && todo.subtasks) {
                const updatedSubtasks = todo.subtasks.map(subtask => {
                    if (subtask.id === subtaskId) {
                        return { ...subtask, completed: !isCompleted };
                    }
                    return subtask;
                });
                
                const allSubtasksCompleted = updatedSubtasks.every(st => st.completed);
                
                return { ...todo, subtasks: updatedSubtasks, completed: allSubtasksCompleted };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };
    
    const getFilteredAndSortedTodos = () => {
        if (!Array.isArray(todos)) { return []; } 
        
        let filtered = todos;

        if (categoryFilter !== 'all') { filtered = filtered.filter(todo => todo.category === categoryFilter); }

        switch (filter) {
            case 'active': filtered = filtered.filter(todo => !todo.completed); break;
            case 'completed': filtered = filtered.filter(todo => todo.completed); break;
            case 'today': filtered = filtered.filter(todo => todo.dueDate && isToday(parseISO(todo.dueDate))); break;
            case 'all': default: break;
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'importance') {
                if (a.important && !b.important) return -1;
                if (!a.important && b.important) return 1;
                if (a.dueDate && b.dueDate) return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
            } else if (sortBy === 'dueDate') {
                if (!a.dueDate) return 1; if (!b.dueDate) return -1;
                return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
            }
            return 0;
        });
    };
    const filteredTodos = getFilteredAndSortedTodos();
    
    const getTaskCount = (key) => {
        const targetTodos = categoryFilter === 'all' ? todos : todos.filter(t => t.category === categoryFilter);
        
        switch (key) {
            case 'active': return targetTodos.filter(t => !t.completed).length;
            case 'completed': return targetTodos.filter(t => t.completed).length;
            case 'today': return targetTodos.filter(t => t.dueDate && isToday(parseISO(t.dueDate))).length;
            case 'all': default: return targetTodos.length;
        }
    };

    const Sidebar = (
        <Box 
            sx={{ width: isSidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED, flexShrink: 0 }}
        >
            <Box sx={{ 
                height: 64, display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-end' : 'center', 
                p: isSidebarOpen ? 1.5 : 0, background: theme.palette.secondary.main, color: 'white',
            }}>
                {isSidebarOpen && <Typography variant="h6" sx={{mr: 2}}>Олексій's Planner</Typography>}
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} color="inherit">
                    {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Divider />

            <List subheader={isSidebarOpen && <ListSubheader>Швидкі Фільтри</ListSubheader>}>
                {['all', 'today', 'active', 'completed'].map((key) => {
                    const label = { 'all': 'Усі Задачі', 'today': 'Сьогодні', 'active': 'Активні', 'completed': 'Виконані' }[key];
                    const iconMap = { 'all': <AllInclusiveIcon />, 'today': <TodayIcon />, 'active': <PendingActionsIcon />, 'completed': <DoneAllIcon /> };
                    const isSelected = filter === key;
                    return (
                        <ListItem key={key} disablePadding>
                            <ListItemButton 
                                selected={isSelected} 
                                onClick={() => { setFilter(key); setCategoryFilter('all'); }}
                                sx={{ '&:hover': { backgroundColor: theme.palette.action.hover, transition: 'all 0.2s ease-out', }, }}
                            >
                                <Box sx={{ minWidth: '40px', display: 'flex', justifyContent: 'center', mr: isSidebarOpen ? 1 : 0, color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary }}>{iconMap[key]}</Box>
                                {isSidebarOpen && <ListItemText primary={label} />}
                                {isSidebarOpen && <Chip label={getTaskCount(key)} size="small" color={isSelected ? 'primary' : 'default'} sx={{ ml: 1, fontWeight: 'bold' }} />}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            
            <List>
                <ListItemButton onClick={() => setOpenCategories(!openCategories)}>
                    <ListItemText primary={isSidebarOpen ? "Категорії" : ""} />
                    {isSidebarOpen ? (openCategories ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
                <Collapse in={openCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {['all', ...CATEGORY_OPTIONS].map((cat) => {
                            const label = cat === 'all' ? 'Усі Категорії' : cat;
                            const isCategorySelected = categoryFilter === cat && filter === 'all';
                            return (
                                <ListItem key={cat} disablePadding>
                                    <ListItemButton 
                                        selected={isCategorySelected} 
                                        onClick={() => { setCategoryFilter(cat); setFilter('all'); }} 
                                        sx={{ 
                                            backgroundColor: isCategorySelected ? theme.palette.action.selected : 'transparent',
                                            '&:hover': { backgroundColor: theme.palette.action.hover, transition: 'all 0.2s ease-out', },
                                            borderLeft: isCategorySelected ? `4px solid ${theme.palette.secondary.main}` : 'none',
                                            paddingLeft: isCategorySelected ? 3.5 : 4,
                                        }}
                                    >
                                        {isSidebarOpen && <ListItemText primary={label} />}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </List>
            <Divider />

            {isSidebarOpen && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Сортувати список</Typography>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="sort-by-label">Метод сортування</InputLabel>
                        <Select labelId="sort-by-label" value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Метод сортування">
                            <MenuItem value="importance">Важливістю (Важливі)</MenuItem>
                            <MenuItem value="dueDate">Датою виконання (Ранні)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default, overflow: 'hidden' }}>
            <CssBaseline />
            
            <Drawer variant="permanent" sx={{ width: isSidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED, flexShrink: 0, transition: 'width 0.3s ease-out', [`& .MuiDrawer-paper`]: { width: isSidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED, boxSizing: 'border-box', transition: 'width 0.3s ease-out', backgroundColor: theme.palette.background.paper, borderRight: theme.palette.mode === 'light' ? '1px solid #ddd' : '1px solid #333', overflowX: 'hidden', }, }}>
                {Sidebar}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: `calc(100% - ${isSidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED}px)`, transition: 'margin-left 0.3s ease-out', overflowY: 'auto' }}>
                {/* ТУТ ЗМІНА: maxWidth="md" */}
                <Container maxWidth="md" component={Paper} elevation={10} 
                    sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, backgroundColor: theme.palette.background.paper, mt: 4, mb: 4 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" component="h1" gutterBottom>Todo List Planner 🚀</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            {filter === 'all' && categoryFilter === 'all' ? 'Усі Задачі' : (categoryFilter !== 'all' ? categoryFilter : filter)}
                        </Typography>
                        
                        <Button 
                            variant="contained" 
                            startIcon={showForm ? <CloseIcon /> : <AddCircleIcon />}
                            color={showForm ? 'error' : 'primary'}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Закрити' : 'Додати Задачу'}
                        </Button>
                    </Box>

                    <Collapse in={showForm}>
                        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                            <TodoForm onAdd={handleAddTodo} />
                        </Paper>
                    </Collapse>
                    
                    <Box sx={{ mt: 3 }}>
                        <TodoList 
                            todos={filteredTodos} 
                            deleteTodo={deleteTodo} 
                            toggleComplete={toggleComplete} 
                            updateTodo={updateTodo} 
                            toggleSubtaskComplete={toggleSubtaskComplete}
                        />
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default TodoApp;