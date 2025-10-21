import axios from 'axios';

async function testCityFilter() {
  try {
    console.log('🧪 Testing City Filter...');
    
    // Test Dubai filter
    const dubaiResponse = await axios.get('http://localhost:5000/api/v1/properties', {
      params: { city: 'Dubai', limit: 5 }
    });
    
    console.log('✅ Dubai Filter Results:');
    console.log(`Found: ${dubaiResponse.data.properties?.length || 0} properties`);
    
    if (dubaiResponse.data.properties?.length > 0) {
      dubaiResponse.data.properties.forEach((item, index) => {
        console.log(`${index + 1}. ${item.property.titleEn} - ${item.property.city}`);
      });
    }
    
    // Test Abu Dhabi filter
    const abuDhabiResponse = await axios.get('http://localhost:5000/api/v1/properties', {
      params: { city: 'Abu Dhabi', limit: 3 }
    });
    
    console.log('\n✅ Abu Dhabi Filter Results:');
    console.log(`Found: ${abuDhabiResponse.data.properties?.length || 0} properties`);
    
  } catch (error) {
    console.error('❌ City Filter Test Failed:', error.response?.data || error.message);
  }
}

testCityFilter();