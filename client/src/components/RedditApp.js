import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Table } from 'antd';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/getFirebaseData?after=${after}`);
      const responseData = response.data.data;

      console.log(responseData);
      if (responseData.children && Array.isArray(responseData.children)) {
        const newPosts = responseData.children.map((child) => {
          if (child && child.data) {
            return child.data;
          } else {
            console.error('Invalid or missing data property in post data:', child);
            return null;
          }
        });

        const validNewPosts = newPosts.filter((post) => post !== null);

        setPosts((prevPosts) => [...prevPosts, ...validNewPosts]);
        setAfter(responseData.after);
        setHasMore(responseData.after !== null);
      } else {
        console.error('Invalid or missing "children" property in API response.');
      }
    } catch (error) {
      console.error('Error fetching data from Reddit:', error);
    }
  };

  const handleScroll = () => {
    if (posts.length >= itemsPerPage) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPostUrl = (url) => {
    console.log('Opening post URL:', url);
  };

  const columns = [
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Allow Live Comments',
      dataIndex: 'allow_live_comments',
      key: 'allow_live_comments',
      render: (text) => text.toString(),
    },
    {
      title: 'Archived',
      dataIndex: 'archived',
      key: 'archived',
      render: (text) => text.toString(),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Upvote Ratio',
      dataIndex: 'upvote_ratio',
      key: 'upvote_ratio',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text) => (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '8px',}}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Link Flair Color',
      dataIndex: 'link_flair_background_color',
      key: 'link_flair_background_color',
      render: (color) => (
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color }}></div>
      ),
    },
    
  ];

  return (
    <div style={{ maxWidth: '99%', margin: '2px' }}>
      <InfiniteScroll
        dataLength={posts.length}
        next={handleScroll}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Table
          dataSource={posts}
          columns={columns}
          loading={!posts}
          rowKey={(record) => record.id}
          pagination={false}
          onRow={(record) => ({
            onClick: () => openPostUrl(record.url),
          })}
        />
      </InfiniteScroll>
    </div>
  );
};

export default App;
