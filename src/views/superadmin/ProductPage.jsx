import React, { useState, useEffect , useRef} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCog,faHistory, faHomeAlt } from '@fortawesome/free-solid-svg-icons';
import { Form ,FormSelect } from 'react-bootstrap';



Modal.setAppElement('#root');

const Sidebar = styled.div`
  width: 170px;
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
  margin-left: 170px;
  padding: 10px;
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #adb5bd;
  font-size:20px;
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
  margin-top: 40px;
`;

const TableHeader = styled.th`
  padding: 12px;
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
  padding: 9px;
  border: 1px solid #ddd;
`;

const EditButton = styled.button`
  background-color: #ffc107;
  color: #fff;
  padding: 6px 10px;
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
  justify-content: flex-end;
  align-items: center;
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
  margin-left: 20px;
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

const PageProduit = () => {
  const [produits, setProduits] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    stock: '',
    statut: 'active',
    image: null,
    imageUrl: '',
    categorie: '',
    tags: '',
    visibilite: 'public',
    descriptionComplete: '',
    id: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInput, setImageInput] = useState('fichier');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const formRef = useRef(null);
  const [setCategories] = useState([]);
  useEffect(() => {
    const recupererCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/produit/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error.response ? error.response.data : error.message);
      }
    };
  
    recupererCategories();
  }, []);
  
  const categories = [
    'fruit',
    'legumes',
    'animales',
    'materiels',
    'plantes',
    'arbres',
  ];

  useEffect(() => {
    if (afficherFormulaire && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [afficherFormulaire]);

  useEffect(() => {
    const recupererProduits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/produit/products');
        console.log('Réponse des produits:', response.data);
        setProduits(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error.response ? error.response.data : error.message);
      }
    };

    recupererProduits();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0], imageUrl: '' });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'imageUrl') {
      setFormData({ ...formData, imageUrl: value, image: null });
      setImagePreview(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.titre);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('descriptionComplete', formData.descriptionComplete);
    formDataToSend.append('price', formData.prix);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('status', formData.statut);
    formDataToSend.append('category', formData.categorie);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('visibility', formData.visibilite);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    } else if (formData.imageUrl) {
      formDataToSend.append('imageUrl', formData.imageUrl);
    }

    try {
      if (formData.id) {
        await axios.put(`http://localhost:5000/produit/products/${formData.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:5000/produit/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setFormData({
        titre: '',
        description: '',
        prix: '',
        stock: '',
        statut: 'active',
        image: null,
        imageUrl: '',
        categorie: '',
        tags: '',
        visibilite: 'public',
        descriptionComplete: '',
        id: null
      });
      setImagePreview(null);
      setImageInput('fichier');
      setAfficherFormulaire(true);
      const response = await axios.get('http://localhost:5000/produit/products');
      setProduits(response.data);
      setAfficherFormulaire(false);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire', error);
    }
  };

  const handleEdit = (produit) => {
    setFormData({
      titre: produit.title,
      description: produit.description,
      prix: produit.price,
      stock: produit.stock,
      statut: produit.status,
      image: null,
      imageUrl: produit.imageUrl || '',
      categorie: produit.category,
      tags: produit.tags || '',
      visibilite: produit.visibility || 'public',
      descriptionComplete: produit.descriptionComplete || '',
      id: produit.id
    });
    setImagePreview(produit.imageUrl || '');
    setImageInput(produit.imageUrl ? 'url' : 'fichier');
    setAfficherFormulaire(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/produit/products/${id}`);
      setProduits(produits.filter((produit) => produit.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/produit/products/${id}/status`, { status });
      setProduits(produits.map((produit) =>
        produit.id === id ? { ...produit, status } : produit
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
    }
  };

  const handleVisibilityChange = async (id, visibility) => {
    try {
      await axios.patch(`http://localhost:5000/produit/products/${id}/visibility`, { visibility });
      setProduits(produits.map((produit) =>
        produit.id === id ? { ...produit, visibility } : produit
      ));
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du produit', error);
    }
  };

  const handleCancel = () => {
    setAfficherFormulaire(false);
    setFormData({
      titre: '',
      description: '',
      prix: '',
      stock: '',
      statut: 'active',
      image: null,
      imageUrl: '',
      categorie: '',
      tags: '',
      visibilite: 'public',
      descriptionComplete: '',
      id: null
    });
    setImagePreview(null);
    setImageInput('fichier');
  };

  // Fonction pour filtrer les produits en fonction de la recherche
  const filteredProduits = produits.filter(produit =>
    produit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produit.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ButtonContainer>
            <AddNewButton onClick={() => setAfficherFormulaire(true)}>+ Ajouter Nouveau</AddNewButton>
          </ButtonContainer>
        </SearchContainer>

        <AdminTable>
          <thead>
            <tr>
              <TableHeader>Titre</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Prix</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader>Image</TableHeader>
              <TableHeader>Catégorie</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Tags</TableHeader>
              <TableHeader>Visibilité</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredProduits.map((produit) => (
              <TableRow key={produit.id}>
                <TableCell>{produit.title}</TableCell>
                <TableCell>{produit.description}</TableCell>
                <TableCell>{produit.price}€</TableCell>
                <TableCell>{produit.stock}</TableCell>
                <TableCell>
                  {produit.imageUrl ? (
                    <img src={produit.imageUrl} alt={produit.title} style={{ width: '100px' }} />
                  ) : (
                    'Aucune image'
                  )}
                </TableCell>
                <TableCell>{produit.category}</TableCell>
                <TableCell><select 
            value={produit.status} 
            onChange={(e) => handleStatusChange(produit.id, e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
</TableCell>
                <TableCell>{produit.tags}</TableCell>
                <TableCell><select 
            value={produit.visibility} 
            onChange={(e) => handleVisibilityChange(produit.id, e.target.value)}
          >
            <option value="public">Public</option>
            <option value="prive">Prive</option>
          </select></TableCell>
                <TableCell>
                  <EditButton onClick={() => handleEdit(produit)}>Modifier</EditButton>
                  <EditButton onClick={() => handleDelete(produit.id)}>Supprimer</EditButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </AdminTable>

        {afficherFormulaire && (
          <FormContainer ref={formRef}>
            <FormTitle>{formData.id ? 'Modifier Produit' : 'Ajouter Produit'}</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormLabel htmlFor="titre">Titre:</FormLabel>
              <FormInput
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
              />

              <FormLabel htmlFor="description">Description:</FormLabel>
              <FormInput
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <FormLabel htmlFor="prix">Prix:</FormLabel>
              <FormInput
                type="number"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                required
              />

              <FormLabel htmlFor="stock">Stock:</FormLabel>
              <FormInput
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />

<FormLabel htmlFor="categorie">Catégorie :</FormLabel>
<FormSelect
  id="categorie"
  name="categorie"
  value={formData.categorie}
  onChange={handleChange}
>
  <option value="">Sélectionner une catégorie</option>
  {categories.map((cat, index) => (
    <option key={index} value={cat}>{cat}</option>
  ))}
</FormSelect>

              <FormLabel htmlFor="tags">Tags:</FormLabel>
              <FormInput
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />

              <FormLabel htmlFor="visibilite">Visibilité:</FormLabel>
              <FormInput
                type="text"
                id="visibilite"
                name="visibilite"
                value={formData.visibilite}
                onChange={handleChange}
                required
              />

              <FormLabel htmlFor="descriptionComplete">Description Complète:</FormLabel>
              <FormInput
                type="text"
                id="descriptionComplete"
                name="descriptionComplete"
                value={formData.descriptionComplete}
                onChange={handleChange}
              />

<FormLabel>Image</FormLabel>
              <div>
                <label>
                  <input 
                    type="radio" 
                    value="fichier" 
                    checked={imageInput === 'fichier'} 
                    onChange={() => setImageInput('fichier')} 
                  />
                  Upload Image
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="url" 
                    checked={imageInput === 'url'} 
                    onChange={() => setImageInput('url')} 
                  />
                  URL Image
                </label>
              </div>
              {imageInput === 'fichier' && (
                <>
                  <FormLabel>Choisir une image</FormLabel>
                  <FormInput 
                    type="file" 
                    name="image" 
                    onChange={handleChange} 
                  />
                  {imagePreview && <img src={imagePreview} alt="Aperçu" style={{ width: '200px', height: 'auto' }} />}
                </>
              )}
              {imageInput === 'url' && (
                <>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormInput 
                    type="text" 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange} 
                  />
                  {imagePreview && <img src={imagePreview} alt="Aperçu" style={{ width: '200px', height: 'auto' }} />}
                </>
              )}
              <SubmitButton type="submit">Enregistrer</SubmitButton>
              <CancelButton type="button" onClick={handleCancel}>Annuler</CancelButton>
            </form>
          </FormContainer>
        )}
      </Content>
    </div>
  );
};

export default PageProduit;
