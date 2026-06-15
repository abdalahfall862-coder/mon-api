import 'reflect-metadata';
import { AppDataSource } from './src/config/database';
import { Category } from './src/entities/Category';
import { Product } from './src/entities/Product';

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Connecté à MongoDB');

  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo  = AppDataSource.getRepository(Product);

  // Nettoyer
  await productRepo.delete({});
  await categoryRepo.delete({});
  console.log('🗑️  Collections vidées');

  // Catégories
  const categories = await categoryRepo.save([
    { name: 'Sacs',         image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&auto=format&fit=crop', description: 'Sacs et maroquinerie' },
    { name: 'Bijoux',       image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=100&auto=format&fit=crop', description: 'Bijoux et montres' },
    { name: 'Mode',         image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop', description: 'Vêtements et chaussures' },
    { name: 'Optique',      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&auto=format&fit=crop', description: 'Lunettes et accessoires' },
    { name: 'Beauté',       image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&auto=format&fit=crop', description: 'Parfums et cosmétiques' },
    { name: 'Accessoires',  image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=100&auto=format&fit=crop', description: 'Ceintures et accessoires' },
  ]);
  console.log(`✅ ${categories.length} catégories créées`);

  const [sacs, bijoux, mode, optique, beaute, accessoires] = categories;

  // Produits
  const products = await productRepo.save([
    {
      name: 'Sac à Main Premium',
      description: 'Sac en cuir véritable, idéal pour toutes occasions.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop',
      price: 15000, stock: 20, categoryId: sacs.id.toString(), isActive: true
    },
    {
      name: 'Sac Bandoulière',
      description: 'Sac pratique et élégant pour le quotidien.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop',
      price: 9000, stock: 15, categoryId: sacs.id.toString(), isActive: true
    },
    {
      name: 'Montre Élégante',
      description: 'Montre classique avec bracelet en acier inoxydable.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop',
      price: 12000, stock: 10, categoryId: bijoux.id.toString(), isActive: true
    },
    {
      name: 'Bracelet Or',
      description: 'Bracelet plaqué or, parfait pour offrir.',
      image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&auto=format&fit=crop',
      price: 85000, stock: 5, categoryId: bijoux.id.toString(), isActive: true
    },
    {
      name: 'Chaussures Sport',
      description: 'Chaussures légères et confortables pour le sport.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop',
      price: 18000, stock: 25, categoryId: mode.id.toString(), isActive: true
    },
    {
      name: 'Chemise Lin',
      description: 'Chemise en lin naturel, fraîche et respirante.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop',
      price: 12000, stock: 30, categoryId: mode.id.toString(), isActive: true
    },
    {
      name: 'Lunettes de Soleil',
      description: 'Protection UV 400, style moderne.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop',
      price: 5000, stock: 40, categoryId: optique.id.toString(), isActive: true
    },
    {
      name: 'Parfum Luxe',
      description: 'Parfum de luxe aux notes florales et boisées.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&auto=format&fit=crop',
      price: 25000, stock: 12, categoryId: beaute.id.toString(), isActive: true
    },
    {
      name: 'Ceinture Cuir',
      description: 'Ceinture en cuir véritable, disponible en plusieurs tailles.',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&auto=format&fit=crop',
      price: 4000, stock: 35, categoryId: accessoires.id.toString(), isActive: true
    },
    {
      name: 'Portefeuille Slim',
      description: 'Portefeuille fin et élégant en cuir.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop',
      price: 6500, stock: 20, categoryId: accessoires.id.toString(), isActive: true
    },
  ]);

  console.log(`✅ ${products.length} produits créés`);
  console.log('🎉 Seed terminé avec succès !');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erreur seed:', err);
  process.exit(1);
});