import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import { useNavigate } from "react-router-dom"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function EnhancedHeader({ setSearch, editItem, searchVisible }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const navigate = useNavigate()
  const isMenuOpen = Boolean(anchorEl)
  const [opens, setOpens] = React.useState(false);
  const [snackContent, setSnackContent] = React.useState("");
  const [severity, setSeverity] = React.useState('success');
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleLogOut = () => {
    setAnchorEl(null)
    localStorage.removeItem("token")
    navigate("/")
    handleSuccess("Log out successfully!");
  }
  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  )
  const handleClosebar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpens(false);
  };

  const handleSuccess = (content) => {
    setSnackContent(content);
    setOpens(true);
    setSeverity('success');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={handleProfileMenuOpen}
            color='inherit'
            disabled={editItem}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography

            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Product Management
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setSearch(e.target.value)}
              disabled={editItem}
            />
          </Search>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Snackbar open={opens} autoHideDuration={3000} onClose={handleClosebar}>
        <MuiAlert onClose={handleClosebar} severity={severity} elevation={6} variant="filled">
          {snackContent}
        </MuiAlert>
      </Snackbar>
    </Box>
    
  );
}