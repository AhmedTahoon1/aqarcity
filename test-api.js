import axios from 'axios';

async function testAPI() {
  try {
    console.log('🧪 Testing Properties API...');
    
    const response = await axios.get('http://localhost:5000/api/v1/properties?limit=5');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Properties Count:', response.data.properties?.length || 0);
    console.log('📄 Pagination:', response.data.pagination);
    
    if (response.data.properties && response.data.properties.length > 0) {
      console.log('\n📋 Sample Property:');
      const sample = response.data.properties[0];
      console.log('- Title:', sample.property.titleEn);
      console.log('- City:', sample.property.city);
      console.log('- Price:', sample.property.price, sample.property.currency);
      console.log('- Features:', JSON.stringify(sample.property.features, null, 2));
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error || error.message);
    console.error('Details:', error.response?.data?.details);
  }
}

testAPI();