const express= require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
port=5000;
const app= express();
app.use(bodyParser.json())

const options = {
    method: 'GET',
    headers: {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
    }
  };

  //Route for fetching data and data analysis
 app.get('/api/blog-stats',async (req,res)=>{
  try {
      const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', options);
      const blogData = await response.json();
      
      // Data Analysis using Lodash
      const TotalBlogs=_.countBy(blogData.blogs)
      const longestBlogTitle=blogData.blogs.reduce((longest, current) => longest.title.length > current.title.length ? longest : current);
      const Privacytitle= blogData.blogs.filter((blog) => blog.title.toLowerCase().includes('privacy') );
      const uniqueTitles = _.uniqBy(blogData.blogs, 'title');
    
      return res
      .status(200)
      .json({
        TotalBlogs,
        longestBlogTitle:longestBlogTitle.title,
        PrivacytitleCount: Privacytitle.length,
        UniqTitleArray: uniqueTitles.map(blog=> blog.title)
      })
  }
  catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
     })


//Route for searching blog endpoints 
  app.get(`/api/blog-search`,async (req,res)=>{
    const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', options);
    const blogSearch= await response.json();
    
     if(req.query.query)
     search=req.query.query
  res.json(blogSearch.blogs,search)

  })
  
//Server 
  app.listen(port,(req,res)=>{
    console.log("server is running on port 5000")
   
  })