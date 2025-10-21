import axios from 'axios';

async function testFeaturesFilter() {
  try {
    console.log('🧪 Testing Features Filter...');
    
    // Test with swimming pool amenity
    const features = {
      amenities: ['swimming_pool'],
      location: [],
      security: []
    };
    
    const response = await axios.get('http://localhost:5000/api/v1/properties', {
      params: {
        features: JSON.stringify(features),
        limit: 10
      }
    });
    
    console.log('✅ Filter Response Status:', response.status);
    console.log('📊 Filtered Properties Count:', response.data.properties?.length || 0);
    
    if (response.data.properties && response.data.properties.length > 0) {
      console.log('\n📋 Properties with Swimming Pool:');
      response.data.properties.forEach((item, index) => {
        const property = item.property;
        console.log(`${index + 1}. ${property.titleEn} - ${property.city}`);
        console.log(`   Amenities: ${property.features.amenities.join(', ')}`);
      });
    } else {
      console.log('❌ No properties found with swimming pool');
    }
    
  } catch (error) {
    console.error('❌ Features Filter Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error || error.message);
    console.error('Details:', error.response?.data?.details);
  }
}

testFeaturesFilter();