import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faHistory, faCog, faHomeAlt } from '@fortawesome/free-solid-svg-icons';


// Style pour la barre latérale
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
  border-right: 2px solid #495057;
`;

// Style pour les liens dans la barre latérale
const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #adb5bd;
  font-size: 22px;
  margin: 18px 0;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #495057;
    color: #fff;
  }
`;

// Conteneur principal avec Flexbox pour aligner l'image et les détails
const DetailContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row; /* Disposer les éléments côte à côte */
  align-items: flex-start;
  gap: 20px; /* Espacement entre l'image et les détails */
  max-width: calc(100% - 250px); /* Largeur maximale en tenant compte de la sidebar */
  margin-left: 250px; /* Espacement pour la sidebar */
  background-color: #f8f9fa;
  border-left: 2px solid #dee2e6;
`;

// Style pour l'image du produit
const ProductImage = styled.img`
  width: 500px; /* Ajustez la largeur selon vos besoins */
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 70px;
`;

// Conteneur pour les détails du produit
const ProductDetails = styled.div`
  flex: 1; /* Permet au conteneur des détails de prendre tout l'espace restant */
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
margin-top: 70px;
`;

// Autres styles
const ProductTitle = styled.h1`
  font-size: 2.5rem;
  margin: 10px 0;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 20px 0;
  line-height: 1.6;
`;


const ProductDetailsComplete = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  margin: 20px 0;
  line-height: 1.6;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #27ae60;
  margin: 10px 0;
`;

const ProductStock = styled.p`
  font-size: 1rem;
  color: #e74c3c;
  margin: 10px 0;
`;

const ProductCategory = styled.p`
  font-size: 1rem;
  color: #3498db;
  margin: 10px 0;
`;


const RequestQuoteButton = styled.button`
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProductDetailPage = () => {
  const { id } = useParams(); // Récupérer l'ID du produit depuis les paramètres de l'URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/produit/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails du produit:', error);
      });
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div>
      <Sidebar>
        <MenuLink to="/dashboard/*">
          <FontAwesomeIcon icon={faHomeAlt} /> Dashboard
        </MenuLink>
        <MenuLink to="/productDetail">
          <FontAwesomeIcon icon={faBox} /> Produits
        </MenuLink>
        <MenuLink to="/history">
          <FontAwesomeIcon icon={faHistory} /> Historique
        </MenuLink>
        <MenuLink to="/settings">
          <FontAwesomeIcon icon={faCog} /> Paramètres
        </MenuLink>
      </Sidebar>
      <DetailContainer>
        <ProductImage src={product.imageUrl} alt={product.title} />
        <ProductDetails>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>Prix: ${product.price.toFixed(2)}</ProductPrice>
          <ProductStock>Stock: {product.stock} unités</ProductStock>
          <ProductCategory>Catégorie: {product.category}</ProductCategory>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductDetailsComplete>{product.descriptionComplete}</ProductDetailsComplete>
          <RequestQuoteButton>Demander un Devis</RequestQuoteButton>
        </ProductDetails>
      </DetailContainer>
    </div>
  );
};

export default ProductDetailPage;
