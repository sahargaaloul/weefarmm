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

const Content = styled.div`
  flex-grow: 1;
  margin-left: 250px;
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden; /* Assure qu'il n'y ait pas de défilement horizontal */
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

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 60px;
  table-layout: auto; /* Ajuste la largeur des colonnes */
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #477FA2;
  color: #fff;
  text-align: left;
  word-wrap: break-word; /* Permet au texte de passer à la ligne si nécessaire */
`;

const TableRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
  word-wrap: break-word; /* Permet au texte de passer à la ligne si nécessaire */
  max-width: 200px; /* Limite la largeur maximale des cellules */
  overflow-wrap: break-word; /* Gère les débordements */
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const DeleteAllButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const AdminHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
  
    useEffect(() => {
      fetchHistory();
    }, []);
  
    const fetchHistory = () => {
      axios.get("/history")
        .then(response => {
          console.log("Données reçues : ", response.data);
          setHistory(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données d'historique des admins !", error);
        });
    };
  
    const handleDelete = (adminEmail) => {
      axios.delete(`/history/${adminEmail}`)
        .then(() => {
          fetchHistory(); // Re-fetch history after deletion
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'entrée d'historique !", error);
        });
    };
  
    const handleDeleteAll = () => {
      axios.delete("/history")
        .then(() => {
          setHistory([]); // Clear history after deletion
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de tous les enregistrements d'historique !", error);
        });
    };
  
    const filteredHistory = history.filter(entry =>
      entry.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by admin email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '250px',
                backgroundColor: '#f8f9fa',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <DeleteAllButton onClick={handleDeleteAll}>Delete All</DeleteAllButton>
          </div>
  
          <HistoryTable>
            <thead>
              <tr>
                <TableHeader>Admin Email</TableHeader>
                <TableHeader>Action</TableHeader>
                <TableHeader>Timestamp</TableHeader>
                <TableHeader>Details</TableHeader>
                <TableHeader>Delete</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.adminEmail}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{JSON.stringify(entry.details)}</TableCell>
                  <TableCell>
                    <DeleteButton onClick={() => handleDelete(entry.adminEmail)}>Delete</DeleteButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </HistoryTable>
        </Content>
      </div>
    );
  };
  
  export default AdminHistory;
