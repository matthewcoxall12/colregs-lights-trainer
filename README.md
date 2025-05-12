# COLREGs Navigation Lights Trainer

An interactive web application for learning and practicing maritime navigation lights according to COLREGs (International Regulations for Preventing Collisions at Sea).

## Features

- Create custom light patterns using an interactive grid
- Save custom presets to local storage
- Switch between teacher and student modes
- Compare your pattern with presets
- Day/Night mode toggle
- Responsive design for various devices

## Installation

1. Clone the repository:
```
git clone https://github.com/matthewcoxall12/colregs-lights-trainer.git
```

2. Navigate to the project directory:
```
cd colregs-lights-trainer
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm start
```

## Deployment to Render

### Prerequisites
- A [Render](https://render.com/) account
- Your project pushed to GitHub

### Deployment Steps

1. Log in to [Render](https://render.com/)
2. Click on "New" and select "Static Site"
3. Connect your GitHub account if you haven't already
4. Select your repository: `matthewcoxall12/colregs-lights-trainer`
5. Configure the following settings:
   - **Name**: `colregs-lights-trainer` (or preferred name)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
6. Click "Create Static Site"

Render will automatically build and deploy your application. Once completed, you'll receive a URL to access your deployed application.

## Contributing

Contributions are welcome! Feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
