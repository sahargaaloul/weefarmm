import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import routes from 'routes'; 
import styled from '@emotion/styled';

// Styled components
const Sidebar = styled.div`
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #343a40;
  color: #fff;
  padding: 20px;
  overflow-y: auto;
`;

const StatusButton = styled.button`
  background-color: ${props => props.status === 'active' ? '#28a745' : '#dc3545'};
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.status === 'active' ? '#218838' : '#c82333'};
  }
`;

const Content = styled.div`
  flex-grow: 1;
  margin-left: 250px;
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #adb5bd;
  font-size: 18px;
  margin: 15px 0;
  
  &:hover {
    color: #fff;
  }
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 60px;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #477FA2;
  color: #fff;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
`;

const EditButton = styled.button`
  background-color: #ffc107;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0a800;
  }
`;

const FormContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  color: #007bff;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background-color: #c82333;
  }
`;


const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligne les éléments à droite */
  align-items: center; /* Centre verticalement les éléments */
  margin-bottom: 20px;
`;


const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  margin-left: 20px; /* Espacement entre la barre de recherche et le bouton */
`;

const AddNewButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const DashboardSuper = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    companyname: '',
    phonenumber: '',
    functionality: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get("/admin/admins")
      .then(response => {
        setAdmins(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the admin data!", error);
      });
  }, []);

  const toggleStatus = (email) => {
    axios.patch(`/admin/admins/${email}/status`)
      .then(response => {
        setAdmins(admins.map(admin => 
          admin.email === response.data.email ? response.data : admin
        ));
      })
      .catch(error => {
        console.error("There was an error updating the status!", error);
      });
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: admin.password,
      firstname: admin.firstname,
      lastname: admin.lastname,
      companyname: admin.companyname,
      phonenumber: admin.phonenumber,
      functionality: admin.functionality
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.patch(`/admin/admins/${formData.email}`, formData)
      .then(response => {
        setAdmins(admins.map(admin => admin.email === response.data.email ? response.data : admin));
        setEditingAdmin(null);
      })
      .catch(error => {
        console.error("There was an error updating the admin!", error);
      });
  };

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {routes.map((route, index) => (
            <li key={index}>
              <MenuLink to={`${route.layout}/${route.path}`}>
                {route.icon}
                <span style={{ marginLeft: '10px' }}>{route.name}</span>
              </MenuLink>
            </li>
            
          ))}
        </ul>
      </Sidebar>

      <Content>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ButtonContainer>
            <AddNewButton to="http://localhost:3000/send-registration-email">+ Add New</AddNewButton>
          </ButtonContainer>
        </SearchContainer>
        
        <AdminTable>
          <thead>
            <tr>
              <TableHeader>Email</TableHeader>
              <TableHeader>Password</TableHeader>
              <TableHeader>First Name</TableHeader>
              <TableHeader>Last Name</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>Phone Number</TableHeader>
              <TableHeader>Functionality</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.password}</TableCell>
                <TableCell>{admin.firstname}</TableCell>
                <TableCell>{admin.lastname}</TableCell>
                <TableCell>{admin.companyname}</TableCell>
                <TableCell>{admin.phonenumber}</TableCell>
                <TableCell>{admin.functionality}</TableCell>
                <TableCell>
                  <StatusButton
                    status={admin.status}
                    onClick={() => toggleStatus(admin.email)}
                  >
                    {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                  </StatusButton>
                </TableCell>
                <TableCell>
                  <EditButton onClick={() => handleEdit(admin)}>Edit</EditButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </AdminTable>

        {editingAdmin && (
          <FormContainer>
            <FormTitle>Edit Admin</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />

              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <FormLabel htmlFor="firstname">First Name</FormLabel>
              <FormInput
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />

              <FormLabel htmlFor="lastname">Last Name</FormLabel>
              <FormInput
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />

              <FormLabel htmlFor="companyname">Company Name</FormLabel>
              <FormInput
                type="text"
                id="companyname"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
              />

              <FormLabel htmlFor="phonenumber">Phone Number</FormLabel>
              <FormInput
                type="text"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
              />

              <FormLabel htmlFor="functionality">Functionality</FormLabel>
              <FormInput
                type="text"
                id="functionality"
                name="functionality"
                value={formData.functionality}
                onChange={handleChange}
              />

              <SubmitButton type="submit">Save</SubmitButton>
              <CancelButton onClick={() => setEditingAdmin(null)}>Cancel</CancelButton>
            </form>
          </FormContainer>
        )}
      </Content>
    </div>
  );
};

export default DashboardSuper;
