const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const ZENDESK_SUBDOMAIN = 'yourcompany';
const ZENDESK_EMAIL = 'admin@company.com';
const ZENDESK_TOKEN = 'YOUR_API_TOKEN';

app.post('/create-ticket', async (req, res) => {
  try {
    const data = req.body;

    const zendeskPayload = {
      ticket: {
        subject: data.subject,
        comment: {
          body: `
Name: ${data.name}
Email: ${data.email}
Department: ${data.department}
Location: ${data.location}
Category: ${data.category}
Sub-Category: ${data.sub_category}

Description:
${data.description}
          `
        },
        priority: data.priority.toLowerCase(),
        requester: {
          name: data.name,
          email: data.email
        },
        tags: data.tags
      }
    };

    const response = await axios.post(
      `https://aurigointernalsupport.zendesk.com/api/v2/tickets.json`,
      zendeskPayload,
      {
        auth: {
          username: `${ZENDESK_EMAIL}/token`,
          password: ZENDESK_TOKEN
        }
      }
    );

    res.json({ ticket_id: response.data.ticket.id });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));