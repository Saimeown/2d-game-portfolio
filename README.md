# 🎮 Interactive 2D Portfolio Game

![Demo](./2d.gif)

An immersive, pixel-art styled portfolio website built as an interactive 2D platformer game using React and Vite. Experience a unique blend of gaming and professional presentation where visitors can explore your portfolio by controlling a character through different scenes.

## ✨ Features

### 🎯 Core Gameplay
- **Character Control**: WASD/Arrow keys for movement and spacebar for jumping
- **Physics Engine**: Realistic gravity, collision detection, and platform mechanics
- **Multi-Scene Navigation**: Seamlessly transition between different portfolio sections
- **Interactive Elements**: Collectible coins, text bubbles, and environmental storytelling

### 🎨 Visual & Audio Experience
- **Pixel Art Aesthetics**: Custom sprite animations for idle, running, and jumping states
- **Dynamic Backgrounds**: Video backgrounds for immersive scenes
- **Sound Design**: Background music, sound effects for actions (jump, run, coin collection)
- **Custom UI Elements**: Pixel-perfect fonts, animated text, and game-style interfaces
- **Responsive Design**: Scales beautifully across different screen sizes

### 🎪 Interactive Portfolio Elements
- **Coin Collection System**: Global coin counter with persistent state
- **Text Bubble Conversations**: Character interactions trigger informational content
- **Animated Typography**: Typewriter effects and bouncing text animations
- **Scene-Based Storytelling**: Each area represents different portfolio sections

### 🔧 Technical Features
- **React 19**: Latest React features with strict mode
- **React Router**: Seamless scene transitions
- **Context Management**: Global state for coins, music, and player position
- **Hot Module Replacement**: Instant development feedback
- **Asset Optimization**: Efficient loading of sprites, sounds, and images
- **Performance Optimized**: Smooth 60fps gameplay with requestAnimationFrame

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Saimeown/my-portfolio.git

# Navigate to project directory
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to start exploring!

## 🎮 How to Play

### Controls
- **Move Left**: `A` or `←` (Left Arrow)
- **Move Right**: `D` or `→` (Right Arrow)  
- **Jump**: `W`, `↑` (Up Arrow), or `Spacebar`
- **Music Toggle**: Click the speaker icon (top right)
- **SFX Toggle**: Click the sound effects icon (top right)

### Gameplay Tips
- Collect coins scattered throughout the scenes
- Touch exclamation mark standees to trigger conversations
- Jump on letter platforms for interactive text effects
- Explore all areas to discover hidden content

## 🏗️ Project Structure

```
my-portfolio/
├── public/
│   └── assets/           # Game assets (sprites, sounds, images)
│       ├── sprite/       # Character animations
│       ├── coin/         # Coin animation frames
│       ├── cursor/       # Custom cursor assets
│       └── pixel-game/   # Custom fonts
├── src/
│   ├── components/       # Reusable game components
│   │   ├── Coin.jsx      # Animated coin component
│   │   ├── Header.jsx    # Game UI header
│   │   ├── PlayerController.jsx  # Character physics & controls
│   │   ├── Sprite.jsx    # Character sprite renderer
│   │   └── TextType.jsx  # Typewriter text effect
│   ├── tabs/            # Different game scenes
│   │   ├── App.jsx      # Main scene
│   │   └── personalInfo.jsx  # Personal info scene
│   ├── constants/       # Game configuration
│   ├── MainApp.jsx      # Root component with providers
│   └── *Context.jsx     # Global state management
└── README.md
```

## 🎯 Game Scenes

### Main Scene (`/`)
- Starting area with platformer challenges
- Environmental storytelling through pixel art buildings
- Route to personal information section

### Personal Info Scene (`/next`)
- Interactive character biography
- Coin collection challenges
- Text bubble conversations

## 🛠️ Technologies Used

- **Frontend**: React 19, React Router DOM
- **Build Tool**: Vite 7.0
- **Styling**: CSS3 with custom animations
- **Audio**: Web Audio API
- **Graphics**: Canvas API, CSS transforms
- **State Management**: React Context API
- **Development**: ESLint, Hot Module Replacement

## 🎨 Asset Credits

- **Pixel Font**: Pixel Game font family
- **Character Sprites**: Custom pixel art animations
- **Sound Effects**: Game-appropriate audio clips
- **Background Music**: Ambient gaming soundtrack

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

*Note: Best experience on desktop with keyboard controls*

## 🚧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Performance Notes
- Optimized sprite loading with preload system
- Efficient collision detection algorithms
- Minimal re-renders with React optimization patterns
- Asset compression for faster loading

## 🎯 Future Enhancements

- [ ] Mobile touch controls
- [ ] Additional scenes/levels
- [ ] Save game functionality
- [ ] Achievements system
- [ ] Multiplayer features
- [ ] More interactive elements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Saimeown/my-portfolio/issues).

## 📧 Contact

**Simon Brian** - [GitHub](https://github.com/Saimeown)

---

⭐ If you enjoyed this interactive portfolio, please consider giving it a star!

*Built with ❤️ and lots of pixels*
