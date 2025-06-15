# Blogger Website

A full-stack blogging platform built with React frontend and Node.js/Express backend, featuring local storage for data persistence.

## 🛠️ Tech Stack

### Frontend
- **React** - User interface library


### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Node LocalStorage** - Data persistence

## 📁 Project Structure

```
blogger-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Blog/
│   │   │   ├── Layout/
│   │   │   └── UI/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── storage/           # Local storage files
│   ├── app.js
│   ├── server.js
│   └── package.json
├── README.md
└── .gitignore
```

### Deployment Configuration
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist` or `build`
- **Environment Variables**: Configured in Vercel dashboard

### Vercel Features Used
- ✅ Automatic deployments from Git
- ✅ Preview deployments for pull requests  
- ✅ Edge network for fast global delivery
- ✅ Serverless functions for backend API


## 👥 Authors

Amar Tatrasi

## 🙏 Acknowledgments

- React community for excellent documentation
- Express.js team for the robust framework
- All contributors who helped improve this project

## 📞 Support

For support, please open an issue on GitHub or contact 

---

⭐ If you found this project helpful, please give it a star on GitHub!
