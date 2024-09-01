import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faHistory, faCog, faHomeAlt } from '@fortawesome/free-solid-svg-icons';


// Styled components pour la barre de recherche et la sidebar
const CategorySelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  margin-right: 20px; /* Espace entre la liste déroulante et la barre de recherche */
  font-size: 1rem;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 40px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  margin-right:15px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
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
  margin-left: 250px; /* espace pour la sidebar */
  padding: 20px;
  width: calc(100% - 250px);
`;

const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-left: 28px;
`;

const ProductCard = styled.div`
  width: 280px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px; /* Hauteur fixe pour les cartes */
`;

const ProductImage = styled.img`
  width: 250px; /* Largeur fixe pour l'image */
  height: 250px; /* Hauteur fixe pour l'image */
  object-fit: cover; /* Maintenir le rapport d'aspect */
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ProductTitle = styled.h3`
  font-size: 1.2rem; /* Taille du texte pour le titre */
  
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem; /* Taille du texte pour la description */
  color: #666;
  flex: 1; /* Permet à la description d'occuper l'espace restant */
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  
  font-weight: bold;
  color: #000;
`;

const DetailsButton = styled(Link)`
  margin-top: auto; /* Pousse le bouton vers le bas de la carte */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
`;

const ProductDetail = () => {
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    // Récupérer les produits depuis le backend
    axios.get('http://localhost:5000/produit/products', {
      params: {
        category: selectedCategory,
        search: searchTerm,
      },
    })
    .then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des produits:', error);
    });
  }, [selectedCategory, searchTerm]);

  


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
      <Content>
      <SearchContainer>
      <SearchInput
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <CategorySelect value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Toutes les catégories</option>
            <option value="fruit">Fruits</option>
            <option value="legumes">Légumes</option>
            <option value="animales">Animaux</option>
            <option value="materiels">Matériaux</option>
            <option value="plantes">Plantes</option>
            <option value="arbres">Arbres</option>
          </CategorySelect>
          
        </SearchContainer>
        <ProductGrid>
  {filteredProducts.map(product => (
    <ProductCard key={product.id}>
      <ProductImage src={product.imageUrl} alt={product.title} />
      <ProductTitle>{product.title}</ProductTitle>
      <ProductDescription>{product.description}</ProductDescription>
      <ProductPrice>Price: ${product.price.toFixed(2)}</ProductPrice>
      <DetailsButton to={`/products/${product.id}`}>Details</DetailsButton>
    </ProductCard>
  ))}
</ProductGrid>
      </Content>
    </div>
  );
};

export default ProductDetail;
