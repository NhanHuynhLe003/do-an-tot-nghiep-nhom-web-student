import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IDrawer from "../../IDrawer";
import CartBookOrder from "./components/cartBookOrder";
import IPopOverBtn from "../../IPopOverBtn";
import { Button } from "@mui/material";
import theme from "../../../theme";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { useGetBooksInCart } from "../../../hooks/apis/cart";
import { useNavigate } from "react-router-dom";
import { useStudentLogout } from "../../../hooks/apis/access";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `1px solid ${theme.palette.background.paper}`,
    right: -2,
    top: -2,
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function MobileMainHeader() {
  const dataStudent = JSON.parse(localStorage.getItem("studentData"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [cartUser, setCartUser] = React.useState([]);

  const { mutate: logout } = useStudentLogout();

  const isMenuOpen = Boolean(anchorEl);

  const { data: dataBooksInCartData } = useGetBooksInCart(
    { cartUserId: dataStudent?._id || null },
    {
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    setCartUser(dataBooksInCartData?.data?.metadata);
  }, [dataBooksInCartData]);

  function handleGetCartProductCount(count) {
    console.log("count", count);
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleClickProfile = () => {
    console.log("click profile");
    handleMenuClose();
    navigate("/student/information");
  };

  const handleClickLogOut = () => {
    handleMenuClose();
    logout();
    localStorage.removeItem("studentData");
    navigate("/student/login");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleClickProfile}>Thông tin của tôi</MenuItem>
      <MenuItem onClick={handleClickLogOut}>Đăng xuất</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="animate__animated animate__fadeInDown">
      <AppBar position="static">
        <Toolbar>
          {/* Mở thanh drawer bên góc trái */}
          <nav>
            <IDrawer
              orientation="left"
              drawerButton={
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2, color: "var(--color-white1)" }}
                >
                  <MenuIcon />
                </IconButton>
              }
            />
          </nav>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            DTTT
          </Typography>

          {/* Thanh Tìm Kiếm */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm Kiếm Sách…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IPopOverBtn
              wrapperStyle={{ marginTop: "0.5rem" }}
              ButtonComponent={
                <Button
                  sx={{
                    color: theme.colors.primary2,
                  }}
                >
                  <StyledBadge badgeContent={cartUser?.length} color="error">
                    <RiShoppingBag4Fill
                      fontSize={"1.75rem"}
                      color="var(--color-primary2)"
                    ></RiShoppingBag4Fill>
                  </StyledBadge>
                </Button>
              }
              ComponentPopOver={
                //=====================Cart Hiển thị khi click vào====================
                <Box>
                  <CartBookOrder
                    handleGetCartProductCount={handleGetCartProductCount}
                  ></CartBookOrder>
                </Box>
              }
            ></IPopOverBtn>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {dataStudent?.profileImage ? (
                <img
                  width={"28px"}
                  height={"28px"}
                  alt="avatar"
                  src={dataStudent?.profileImage}
                ></img>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>

      {renderMenu}

      {/* Drawer navigation */}
    </Box>
  );
}
