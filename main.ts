Here is the TypeScript code to consume the provided APIs using Axios:

```typescript
import axios from 'axios';

const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';
const BASE_URL = 'https://api-dev.on-demand.io/chat/v1';

// Function to create a chat session
async function createChatSession(): Promise<string> {
  try {
    const response = await axios.post(
      `${BASE_URL}/sessions`,
      {
        pluginIds: [],
        externalUserId: EXTERNAL_USER_ID,
      },
      {
        headers: {
          apikey: API_KEY,
        },
      }
    );

    if (response.status === 201) {
      const sessionId = response.data?.data?.id;
      console.log('Chat session created successfully:', sessionId);
      return sessionId;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

// Function to submit a query
async function submitQuery(sessionId: string, query: string, responseMode: 'sync' | 'stream' = 'sync'): Promise<void> {
  const body = {
    endpointId: 'predefined-openai-gpt4o',
    query,
    pluginIds: [
      'plugin-1712327325',
      'plugin-1713962163',
      'plugin-1716164040',
      'plugin-1722504304',
      'plugin-1713954536',
      'plugin-1713958591',
      'plugin-1713958830',
      'plugin-1713961903',
      'plugin-1713967141',
    ],
    responseMode,
    reasoningMode: 'medium',
  };

  try {
    if (responseMode === 'sync') {
      const response = await axios.post(`${BASE_URL}/sessions/${sessionId}/query`, body, {
        headers: {
          apikey: API_KEY,
        },
      });

      if (response.status === 200) {
        console.log('Query response:', response.data);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } else if (responseMode === 'stream') {
      const url = `${BASE_URL}/sessions/${sessionId}/query`;
      const headers = { apikey: API_KEY };

      const source = new EventSourcePolyfill(url, {
        headers,
        method: 'POST',
        body: JSON.stringify(body),
      });

      source.onmessage = (event) => {
        console.log('Streaming response:', event.data);
      };

      source.onerror = (error) => {
        console.error('Error during streaming:', error);
        source.close();
      };
    }
  } catch (error) {
    console.error('Error submitting query:', error);
    throw error;
  }
}

// Main function to execute the flow
async function main() {
  try {
    const sessionId = await createChatSession();
    const query = 'Put your query here';

    // Submit query in sync mode
    await submitQuery(sessionId, query, 'sync');

    // Uncomment the following line to submit query in stream mode
    // await submitQuery(sessionId, query, 'stream');
  } catch (error) {
    console.error('Error in main flow:', error);
  }
}

main();
```

### Notes:
1. **Dependencies**: Install the required libraries:
   ```bash
   npm install axios eventsource-polyfill
   ```

2. **Streaming Mode**: The `EventSourcePolyfill` library is used for handling Server-Sent Events (SSE) with POST requests. Replace `EventSourcePolyfill` with your preferred SSE library if needed.

3. **Replace Placeholders**: Replace `<replace_api_key>` and `<replace_external_user_id>` with actual values before running the code.