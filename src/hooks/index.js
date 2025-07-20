import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut as logOutAction } from "@redux/slices/authSlice";
import { useMemo } from "react";
import { throttle } from "lodash";
import { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useGetPostsQuery } from "@services/postApi";
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logOutAction());
    navigate("/login", { replace: true });
  };

  return { logOut };
};

export const useUserInfo = () => {
  return useSelector((state) => state.auth.userInfo);
};

export const useDetectLayout = () => {
  const theme = useTheme();
  const isMediumLayout = useMediaQuery(theme.breakpoints.down("md"));

  return { isMediumLayout };
};

export const useLazyLoadPosts = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isSuccess, isFetching } = useGetPostsQuery({ offset, limit });

  console.log("useLazyLoadPosts", { data, offset });

  const previousDataRef = useRef();
  useEffect(() => {
    if (isSuccess && data && previousDataRef.current !== data) {
      if (!data.length) {
        setHasMore(false);
        return;
      }
      previousDataRef.current = data;
      setPosts((prevPosts) => {
        if (offset === 0) return data;
        return [...prevPosts, ...data];
      });
    }
  }, [data, isSuccess]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);

  useInfiniteScroll({
    hasMore,
    loadMore,
    isFetching,
    offset,
    resetFn: () => {
      setOffset(0);
      setHasMore(true);
      previousDataRef.current = null;
    },
  });

  return { isFetching, posts };
};

export const useInfiniteScroll = ({
  hasMore,
  loadMore,
  isFetching,
  offset,
  resetFn,
  threshold = 50,
  throttleMs = 500,
}) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop === 0 && offset > 0) {
        resetFn();
        return;
      }

      if (!hasMore) {
        return;
      }

      if (clientHeight + scrollTop + threshold >= scrollHeight && !isFetching) {
        loadMore();
      }
    }, throttleMs);
  }, [hasMore, isFetching, loadMore, threshold, throttleMs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);
};
