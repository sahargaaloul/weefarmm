import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faHistory, faCog, faHomeAlt } from '@fortawesome/free-solid-svg-icons';

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
  font-size: 22px;
  margin: 18px 0;
  
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
  position: relative;
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

const ToggleLink = styled.a`
  color: #007bff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({}); // État pour suivre quelles lignes sont étendues

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios.get("/producthistory")
      .then(response => {
        console.log("Données reçues : ", response.data);
        setHistory(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données d'historique des produits !", error);
      });
  };

  const handleDelete = (productId) => {
    axios.delete(`/producthistory/${productId}`)
      .then(() => {
        fetchHistory(); // Re-fetch history after deletion
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de l'entrée d'historique !", error);
      });
  };

  const handleDeleteAll = () => {
    axios.delete("/producthistory")
      .then(() => {
        setHistory([]); // Clear history after deletion
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de tous les enregistrements d'historique !", error);
      });
  };

  const filteredHistory = history.filter(entry =>
    entry.productId.toString().includes(searchTerm)
  );

  const handleToggleDetails = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar>
        <MenuLink to="/product">
          <FontAwesomeIcon icon={faHomeAlt} /> Dashboard
        </MenuLink>
        <MenuLink to="/productDetail">
          <FontAwesomeIcon icon={faBox} /> Produits
        </MenuLink>
        <MenuLink to="/producthistory">
          <FontAwesomeIcon icon={faHistory} /> Historique
        </MenuLink>
        <MenuLink to="/settings">
          <FontAwesomeIcon icon={faCog} /> Paramètres
        </MenuLink>
      </Sidebar>

      <Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by product ID"
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
              <TableHeader>Product ID</TableHeader>
              <TableHeader>Action</TableHeader>
              <TableHeader>Timestamp</TableHeader>
              <TableHeader>Details</TableHeader>
              <TableHeader>Delete</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.productId}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  {expandedRows[index] ? (
                    <div>
                      {JSON.stringify(entry.details)}
                      <ToggleLink onClick={() => handleToggleDetails(index)}> Voir moins</ToggleLink>
                    </div>
                  ) : (
                    <div>
                      {JSON.stringify(entry.details).length > 100 ? (
                        <>
                          {JSON.stringify(entry.details).substring(0, 100)}...
                          <ToggleLink onClick={() => handleToggleDetails(index)}> Voir plus</ToggleLink>
                        </>
                      ) : (
                        JSON.stringify(entry.details)
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <DeleteButton onClick={() => handleDelete(entry.productId)}>Delete</DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </HistoryTable>
      </Content>
    </div>
  );
};

export default ProductHistory;
