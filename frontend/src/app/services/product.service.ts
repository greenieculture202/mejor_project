import { Injectable } from '@angular/core';

export interface Product {
    image: string;
    hoverImage?: string; // New property for hover effect
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
    discountPercent?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // 20 Mock Products for each category
    private allProducts: { [key: string]: Product[] } = {
        'Bestsellers': [
            {
                name: 'Majestic Zen Garden',
                price: '₹1999',
                originalPrice: '₹2499',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://tse2.mm.bing.net/th/id/OIP.X3jDS9J58Q4ilo4vgjh-RAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3',
                hoverImage: 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg'
            },
            {
                name: 'Jade Luck Charm',
                price: '₹449',
                originalPrice: '₹499',
                discount: '10% OFF',
                discountPercent: 10,
                image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Peace Lily Purification',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Snake Plant Sansevieria',
                price: '₹299',
                originalPrice: '₹499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Money Plant Golden',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Areca Palm',
                price: '₹599',
                originalPrice: '₹899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Rubber Plant Burgundy',
                price: '₹499',
                originalPrice: '₹699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'ZZ Plant Zamia',
                price: '₹349',
                originalPrice: '₹549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Fiddle Leaf Fig',
                price: '₹899',
                originalPrice: '₹1299',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1601985705806-8b998a3458ae?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Bamboo Palm',
                price: '₹649',
                originalPrice: '₹849',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat for 20
            {
                name: 'Majestic Zen Garden II',
                price: '₹1999',
                originalPrice: '₹2499',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            { name: 'Jade Luck Charm II', price: '₹449', originalPrice: '₹499', discount: '10% OFF', discountPercent: 10, image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80' },
            { name: 'Peace Lily Purification II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80' },
            { name: 'Snake Plant Sansevieria II', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80' },
            { name: 'Money Plant Golden II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Areca Palm II', price: '₹599', originalPrice: '₹899', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80' },
            { name: 'Rubber Plant Burgundy II', price: '₹499', originalPrice: '₹699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80' },
            { name: 'ZZ Plant Zamia II', price: '₹349', originalPrice: '₹549', discount: '36% OFF', discountPercent: 36, image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80' },
            { name: 'Fiddle Leaf Fig II', price: '₹899', originalPrice: '₹1299', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1601985705806-8b998a3458ae?auto=format&fit=crop&w=600&q=80' },
            { name: 'Bamboo Palm II', price: '₹649', originalPrice: '₹849', discount: '23% OFF', discountPercent: 23, image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' }
        ],
        'New Arrivals': [
            {
                name: 'Monstera Deliciosa',
                price: '₹799',
                originalPrice: '₹999',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'String of Pearls',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Calathea Roseopicta',
                price: '₹549',
                originalPrice: '₹749',
                discount: '26% OFF',
                discountPercent: 26,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Aglaonema Red',
                price: '₹449',
                originalPrice: '₹649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Philodendron Birkin',
                price: '₹999',
                originalPrice: '₹1299',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Begonia Maculata',
                price: '₹699',
                originalPrice: '₹899',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Syngonium Pink',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Neon Pothos',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Hoya Kerrii Heart',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Orchid Mini',
                price: '₹899',
                originalPrice: '₹1199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat
            { name: 'Monstera Deliciosa II', price: '₹799', originalPrice: '₹999', discount: '20% OFF', discountPercent: 20, image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'String of Pearls II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Calathea Roseopicta II', price: '₹549', originalPrice: '₹749', discount: '26% OFF', discountPercent: 26, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80' },
            { name: 'Aglaonema Red II', price: '₹449', originalPrice: '₹649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Philodendron Birkin II', price: '₹999', originalPrice: '₹1299', discount: '23% OFF', discountPercent: 23, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Begonia Maculata II', price: '₹699', originalPrice: '₹899', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Syngonium Pink II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
            { name: 'Neon Pothos II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80' },
            { name: 'Hoya Kerrii Heart II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Orchid Mini II', price: '₹899', originalPrice: '₹1199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80' }
        ],
        'Indoor Plants': [
            {
                name: 'Spider Plant',
                price: '₹149',
                originalPrice: '₹249',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Satin Pothos',
                price: '₹299',
                originalPrice: '₹399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Boston Fern',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Dracaena Compacta',
                price: '₹499',
                originalPrice: '₹699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Aloe Vera',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Jade Plant',
                price: '₹349',
                originalPrice: '₹449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Rubber Plant',
                price: '₹599',
                originalPrice: '₹799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Syngonium',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Areca Palm',
                price: '₹499',
                originalPrice: '₹699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Dieffenbachia',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat
            { name: 'Spider Plant II', price: '₹149', originalPrice: '₹249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Satin Pothos II', price: '₹299', originalPrice: '₹399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Boston Fern II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80' },
            { name: 'Dracaena Compacta II', price: '₹499', originalPrice: '₹699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Aloe Vera II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Jade Plant II', price: '₹349', originalPrice: '₹449', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80' },
            { name: 'Rubber Plant II', price: '₹599', originalPrice: '₹799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80' },
            { name: 'Syngonium II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Areca Palm II', price: '₹499', originalPrice: '₹699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80' },
            { name: 'Dieffenbachia II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80' }
        ],
        'Outdoor Plants': [
            {
                name: 'Bougainvillea',
                price: '₹299',
                originalPrice: '₹499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Hibiscus',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Jasmine',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Rose Plant',
                price: '₹349',
                originalPrice: '₹449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Marigold',
                price: '₹149',
                originalPrice: '₹199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Tulsi Holy Basil',
                price: '₹99',
                originalPrice: '₹149',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Curry Leaf Plant',
                price: '₹129',
                originalPrice: '₹199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Ashoka Tree',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Neem Plant',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Mango Plant',
                price: '₹499',
                originalPrice: '₹799',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat
            { name: 'Bougainvillea II', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Hibiscus II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Jasmine II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Rose Plant II', price: '₹349', originalPrice: '₹449', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80' },
            { name: 'Marigold II', price: '₹149', originalPrice: '₹199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80' },
            { name: 'Tulsi Holy Basil II', price: '₹99', originalPrice: '₹149', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Curry Leaf Plant II', price: '₹129', originalPrice: '₹199', discount: '35% OFF', discountPercent: 35, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
            { name: 'Ashoka Tree II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Neem Plant II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Mango Plant II', price: '₹499', originalPrice: '₹799', discount: '37% OFF', discountPercent: 37, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' }
        ],
        'Money Plants': [
            {
                name: 'Golden Money Plant',
                price: '₹149',
                originalPrice: '₹199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Marble Queen Pathos',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Money Plant Njoy',
                price: '₹299',
                originalPrice: '₹399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Neon Money Plant',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Big Leaf Money Plant',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Money Plant Variegated',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Green Money Plant',
                price: '₹129',
                originalPrice: '₹199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Satin Money Plant',
                price: '₹299',
                originalPrice: '₹449',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Manjula Money Plant',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Cebu Blue Pothos',
                price: '₹599',
                originalPrice: '₹899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat
            { name: 'Golden Money Plant II', price: '₹149', originalPrice: '₹199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Marble Queen Pathos II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Money Plant Njoy II', price: '₹299', originalPrice: '₹399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80' },
            { name: 'Neon Money Plant II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Big Leaf Money Plant II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Money Plant Variegated II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80' },
            { name: 'Green Money Plant II', price: '₹129', originalPrice: '₹199', discount: '35% OFF', discountPercent: 35, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
            { name: 'Satin Money Plant II', price: '₹299', originalPrice: '₹449', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Manjula Money Plant II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Cebu Blue Pothos II', price: '₹599', originalPrice: '₹899', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' }
        ],
        'Air Purifying': [
            {
                name: 'Snake Plant',
                price: '₹299',
                originalPrice: '₹499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Areca Palm',
                price: '₹499',
                originalPrice: '₹699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Spider Plant',
                price: '₹149',
                originalPrice: '₹249',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Peace Lily',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Rubber Plant',
                price: '₹599',
                originalPrice: '₹799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Aloe Vera',
                price: '₹199',
                originalPrice: '₹299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'English Ivy',
                price: '₹249',
                originalPrice: '₹349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Boston Fern',
                price: '₹399',
                originalPrice: '₹599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'ZZ Plant',
                price: '₹349',
                originalPrice: '₹549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Philodendron',
                price: '₹449',
                originalPrice: '₹649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80'
            },
            // Repeat
            { name: 'Snake Plant II', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Areca Palm II', price: '₹499', originalPrice: '₹699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Spider Plant II', price: '₹149', originalPrice: '₹249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Peace Lily II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80' },
            { name: 'Rubber Plant II', price: '₹599', originalPrice: '₹799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Aloe Vera II', price: '₹199', originalPrice: '₹299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80' },
            { name: 'English Ivy II', price: '₹249', originalPrice: '₹349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Boston Fern II', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80' },
            { name: 'ZZ Plant II', price: '₹349', originalPrice: '₹549', discount: '36% OFF', discountPercent: 36, image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80' },
            { name: 'Philodendron II', price: '₹449', originalPrice: '₹649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80' }
        ]
    };

    constructor() { }

    getProducts(category: string): Product[] {
        return this.allProducts[category] || [];
    }

    getAllProductsMap() {
        return this.allProducts;
    }

    getProductBySlug(slug: string): Product | undefined {
        const allCategories = Object.values(this.allProducts);
        for (const categoryProducts of allCategories) {
            const product = categoryProducts.find(p => this.createSlug(p.name) === slug);
            if (product) {
                return product;
            }
        }
        return undefined;
    }

    createSlug(name: string): string {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
}
