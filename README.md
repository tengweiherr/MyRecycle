# MyRecycle
Final Year Project, Undergraduate Computer Science, Universiti Sains Malaysia 2022

by Teng Wei Herr

## Awards
1. **Gold Award & AIA Special Award** <sub>*Issued by Korea Creative Invention Contest (CiC) 2022*</sub>
2. **Gold Award** <sub>*Issued by PIXEL USM 2022*</sub>


## Project Background
Environmental pollution and waste management have become a global concern in the 21st century. The recycling rate in Malaysia is only at 31.52% in 2021 while it is over 60% in most developed countries. In Malaysia, National Solid Waste Department (JPSPN) is the official agency responsible for waste management, licensing waste collectors and providing information such as recycling guide. However, it is inefficient for recyclers to search and read the information from the website. Therefore, MyRecycle(MR), a combination of mobile and web applications is introduced to bridge the gap by improving the current method along with extra features to encourage the public to practice recycling.

MyRecycle(MR) is the first application that integrates a government-licensed waste collector search engine with live navigation. MR is also the only application in Malaysia providing a product search engine with a barcode scanner to check the product information and whether it is recyclable. In addition, MR provides an educational game for users to play while learning the recycling awareness and earning points. MR also provides a trackable report filing platform and rewarding system. Multi-layered verifications are implemented for the admin to manage the data in the mobile app.


|   | Tech deployed |
| ------------- | ------------- |
| Frontend - mobile app  | React Native, JavaScript |
| Frontend - webapp | ReactJS, TypeScript |
| Backend | NodeJS, Express, Sequalize(ORM) |
| Database | MySQL |
| Hosting | Netlify, Heroku |

## Challenges and Solutions

### 1. CORS

I faced the CORS issue when I created HTTP request to access resource from API after hosting the client-side on Netlify and server on Heroku. 

This issue occurs to me when the HTTP request takes place between client on Netlify and server on Heroku. This is a security mechanism for the browser because both sides have different origin or domain:

- Client side: https://...netlify.app/...
- Server side: https://...herokuapp.com/...

This is where CORS comes into play. CORS stands for Cross-Origin Resource Sharing. It adds a response header **access-control-allow-origins** and specify which domains are permitted. The response will then sent out by server, while the browser on the client machine will look at this header and decide whether it is safe to deliver that response to the client or not.

To solve this error, we need to add the CORS header to the server response and give access to the specific clients.
```javascript
const cors = require('cors'); // CommonJS
import cors from 'cors'; // ES6

app.use(cors({
    origin: 'https://www...', //your client side domain
    origin: ['https://www...', 'https://www...'], //multiple domains
    origin: '*' //any domains can access
}))
```

Reference: https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/

### 2. Rendering large amount of data

There was always delay when rendering the large amount of data (over 2000) on both mobile app and web app. After some research, these are the implementation:
1. Mobile App

I used Flatlist from NativeBase to render the large amount of data. FlatList from NativeBase is just an modified version of flatlist from React Native, which serves the same purpose - A performant interface for rendering list of data.

```javascript
//correct example
<FlatList
    data={filteredData}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    renderItem={renderItem}
    keyExtractor={(item) => parseInt(item.gtin)}
/>

const renderItem = ({item}) => (
<Box>...</Box>
)
```

Notice the props **initialNumToRender** and **maxToRenderPerBatch**. They are the keys to improve the large amount data rendering. Another approach is to  create a seperate function for the **renderItem** instead of create the item inside of the flatlist. Here is the opposite way to do so:

```javascript
//wrong example
<FlatList
    data={filteredData}
    renderItem={({ item }) => (
      <Box>...</Box>
    )}
    keyExtractor={(item) => parseInt(item.id)}
/>
```

References: 
1. https://docs.nativebase.io/flat-list
1. https://reactnative.dev/docs/flatlist
