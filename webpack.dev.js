const path = require('path');

module.exports = {
  plugins: [],
  entry: { 
	  home: './src/home.js',
    deferhome: './src/deferhome.js',
    translation: './src/translation.js',
	  graphs: './src/graphs.js',
	  cybersecurity: './src/cybersecurity.js',
    pillars: './src/pillars.js',
    robotics: './src/robotics.js',
    quantum: './src/quantum.js',
  },
  mode: 'development',
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist/src'),
  },

  module: {
    rules: [      
      {        
	test: /\.js$/i,        
	include: path.resolve(__dirname, 'src'),        
	use: {          
	  loader: 'babel-loader',          
	  options: {            
	    presets: ['@babel/preset-env'],
          },
	},
      },
      {        
	test: /\.css$/i,        
	include: path.resolve(__dirname, 'src'),        
	use: ['style-loader', 'css-loader', 'postcss-loader'],      
      },    
    ],  
  },

};
