// Utility function to transform property results with default agent info
export const transformPropertyResult = (result: any) => ({
  property: {
    ...result.property,
    agent: result.agent ? {
      id: result.agent.id,
      phone: result.agent.phone,
      whatsapp: result.agent.whatsapp,
      email: result.agent.email
    } : {
      id: null,
      phone: '+971501234567',
      whatsapp: '+971501234567',
      email: 'info@aqarcity.ae'
    }
  },
  agent: result.agent,
  developer: result.developer
});