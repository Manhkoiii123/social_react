import { useDetectLayout, useLogout, useUserInfo } from "@hooks/index";
import { Search, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
} from "@mui/material";
import { toggleDrawer } from "@redux/slices/settingsSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userInfo = useUserInfo();
  const { logOut } = useLogout();
  const { isMediumLayout } = useDetectLayout();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <MenuItem>
        <Link to={`/users/${userInfo._id}`} onClick={handleMenuClose}>
          Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={() => logOut()}>Logout</MenuItem>
    </Menu>
  );

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.target);
  };

  return (
    <div>
      <AppBar color="white" position="static">
        <Toolbar className="container !min-h-fit justify-between">
          {isMediumLayout ? (
            <IconButton onClick={() => dispatch(toggleDrawer())}>
              <MenuIcon />
            </IconButton>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src="/weconnect-logo.png" className="h-8 w-8" />
              </Link>
              <div className="flex items-center gap-1">
                <Search />
                <TextField
                  variant="standard"
                  name="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate("/search/users", {
                        state: {
                          searchTerm,
                        },
                      });
                    }
                  }}
                  slotProps={{
                    input: { className: "h-10 px-3 py-2" },
                    htmlInput: { className: "!p-0" },
                  }}
                  sx={{
                    ".MuiInputBase-root::before": {
                      display: "none",
                    },
                  }}
                />
              </div>
            </div>
          )}
          <div>
            {isMediumLayout && (
              <IconButton>
                <Search />
              </IconButton>
            )}
            <NotificationsPanel />
            <IconButton size="medium" onClick={handleUserProfileClick}>
              <Avatar className="!bg-primary-main">
                {userInfo.fullName?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
};
export default Header;
