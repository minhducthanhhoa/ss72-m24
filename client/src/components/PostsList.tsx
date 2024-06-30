import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, selectAllPosts, blockPost, unblockPost } from '../redux/reducers/postSlice';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Input, Select, Pagination } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import type { ColumnsType } from 'antd/es/table';
import type { Post } from '../redux/reducers/postSlice';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

const PostsList: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector((state: any) => state.posts.status);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>('ascend');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const showDeleteConfirm = (id: number, status: string) => {
    confirm({
      title: `Bạn có chắc chắn muốn ${status === 'Đã xuất bản' ? 'ngừng xuất bản' : 'xuất bản lại'} bài viết?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (status === 'Đã xuất bản') {
          dispatch(blockPost(id));
        } else {
          dispatch(unblockPost(id));
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    dispatch(fetchPosts()); // Update to handle search filtering on the backend
  }, 300);

  const handleSortChange = (value: 'ascend' | 'descend') => {
    setSortOrder(value);
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => <img src={thumbnail} alt="Thumbnail" width={100} />,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Ngày viết',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => showDeleteConfirm(record.id, record.status)}>
          {record.status === 'Đã xuất bản' ? 'Ngừng xuất bản' : 'Xuất bản lại'}
        </Button>
      ),
    },
  ];

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <div className="container mx-auto my-4">
      <div className="flex justify-between mb-4">
        <Link to="/new">
          <Button type="primary">Thêm mới bài viết</Button>
        </Link>
        <Search placeholder="Tìm kiếm bài viết" onChange={(e) => handleSearch(e.target.value)} />
        <Select defaultValue="ascend" onChange={handleSortChange}>
          <Option value="ascend">A đến Z</Option>
          <Option value="descend">Z đến A</Option>
        </Select>
      </div>
      <Table
        dataSource={filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredPosts.length}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PostsList;
