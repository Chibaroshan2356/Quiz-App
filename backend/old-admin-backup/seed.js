const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
require('dotenv').config();

// Sample quizzes data
const sampleQuizzes = [
  // Programming Category - 3 quizzes
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and data types.",
    category: "Programming",
    difficulty: "easy",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: [
          "var name = 'John';",
          "variable name = 'John';",
          "v name = 'John';",
          "declare name = 'John';"
        ],
        correctAnswer: 0,
        explanation: "The 'var' keyword is used to declare variables in JavaScript.",
        points: 1
      },
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: [
          "String",
          "Boolean",
          "Float",
          "Undefined"
        ],
        correctAnswer: 2,
        explanation: "JavaScript has Number (not Float), String, Boolean, Undefined, Null, Symbol, and BigInt data types.",
        points: 1
      },
      {
        question: "What does the 'typeof' operator return for an array?",
        options: [
          "array",
          "object",
          "Array",
          "list"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, arrays are objects, so typeof returns 'object'.",
        points: 1
      },
      {
        question: "Which method is used to add an element to the end of an array?",
        options: [
          "push()",
          "append()",
          "add()",
          "insert()"
        ],
        correctAnswer: 0,
        explanation: "The push() method adds one or more elements to the end of an array.",
        points: 1
      }
    ]
  },
  {
    title: "Python Programming Basics",
    description: "Test your understanding of Python syntax, data structures, and basic programming concepts.",
    category: "Programming",
    difficulty: "medium",
    timeLimit: 180,
    questions: [
      {
        question: "What is the correct way to create a list in Python?",
        options: [
          "list = [1, 2, 3]",
          "list = (1, 2, 3)",
          "list = {1, 2, 3}",
          "list = <1, 2, 3>"
        ],
        correctAnswer: 0,
        explanation: "Lists in Python are created using square brackets []. Tuples use (), sets use {}, and there's no <> syntax.",
        points: 1
      },
      {
        question: "Which keyword is used to define a function in Python?",
        options: [
          "function",
          "def",
          "func",
          "define"
        ],
        correctAnswer: 1,
        explanation: "The 'def' keyword is used to define functions in Python.",
        points: 1
      },
      {
        question: "What will be the output of: print(3 ** 2)?",
        options: [
          "6",
          "9",
          "32",
          "Error"
        ],
        correctAnswer: 1,
        explanation: "The ** operator is exponentiation, so 3 ** 2 = 3² = 9.",
        points: 1
      },
      {
        question: "Which method is used to get the length of a string in Python?",
        options: [
          "length()",
          "len()",
          "size()",
          "count()"
        ],
        correctAnswer: 1,
        explanation: "The len() function returns the length of a string, list, or other iterable.",
        points: 1
      },
      {
        question: "What is the result of: 'Hello' + 'World'?",
        options: [
          "HelloWorld",
          "Hello World",
          "Error",
          "Hello+World"
        ],
        correctAnswer: 0,
        explanation: "The + operator concatenates strings without adding spaces.",
        points: 1
      }
    ]
  },
  {
    title: "Web Development Essentials",
    description: "Test your knowledge of HTML, CSS, and web development fundamentals.",
    category: "Programming",
    difficulty: "hard",
    timeLimit: 180,
    questions: [
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets"
        ],
        correctAnswer: 2,
        explanation: "CSS stands for Cascading Style Sheets, which is used to style HTML elements.",
        points: 1
      },
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
          "<link>",
          "<a>",
          "<href>",
          "<url>"
        ],
        correctAnswer: 1,
        explanation: "The <a> tag is used to create hyperlinks in HTML.",
        points: 1
      },
      {
        question: "What is the correct way to include an external CSS file?",
        options: [
          "<style src='style.css'>",
          "<link rel='stylesheet' href='style.css'>",
          "<css src='style.css'>",
          "<import href='style.css'>"
        ],
        correctAnswer: 1,
        explanation: "External CSS files are linked using the <link> tag with rel='stylesheet' and href attributes.",
        points: 1
      },
      {
        question: "Which CSS property is used to change the text color?",
        options: [
          "text-color",
          "color",
          "font-color",
          "text-style"
        ],
        correctAnswer: 1,
        explanation: "The 'color' property is used to set the text color in CSS.",
        points: 1
      },
      {
        question: "What does the 'box-sizing: border-box' CSS property do?",
        options: [
          "Adds a border to all elements",
          "Includes padding and border in element's total width",
          "Removes all borders",
          "Creates a box shadow"
        ],
        correctAnswer: 1,
        explanation: "border-box includes padding and border in the element's total width and height.",
        points: 2
      }
    ]
  },
  // Geography Category - 3 quizzes
  {
    title: "World Geography Challenge",
    description: "Explore the world with questions about countries, capitals, and geographical features.",
    category: "Geography",
    difficulty: "medium",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "What is the capital of Australia?",
        options: [
          "Sydney",
          "Melbourne",
          "Canberra",
          "Perth"
        ],
        correctAnswer: 2,
        explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne.",
        points: 1
      },
      {
        question: "Which is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean"
        ],
        correctAnswer: 2,
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
        points: 1
      },
      {
        question: "What is the longest river in the world?",
        options: [
          "Amazon River",
          "Nile River",
          "Mississippi River",
          "Yangtze River"
        ],
        correctAnswer: 1,
        explanation: "The Nile River is considered the longest river in the world at approximately 6,650 km.",
        points: 1
      },
      {
        question: "Which country has the most natural lakes?",
        options: [
          "Russia",
          "Canada",
          "United States",
          "Finland"
        ],
        correctAnswer: 1,
        explanation: "Canada has the most natural lakes in the world, with over 2 million lakes.",
        points: 1
      },
      {
        question: "What is the smallest country in the world?",
        options: [
          "Monaco",
          "Vatican City",
          "San Marino",
          "Liechtenstein"
        ],
        correctAnswer: 1,
        explanation: "Vatican City is the smallest country in the world by both area and population.",
        points: 1
      }
    ]
  },
  {
    title: "European Capitals & Countries",
    description: "Test your knowledge of European geography, capitals, and countries.",
    category: "Geography",
    difficulty: "easy",
    timeLimit: 180,
    questions: [
      {
        question: "What is the capital of France?",
        options: [
          "Lyon",
          "Marseille",
          "Paris",
          "Nice"
        ],
        correctAnswer: 2,
        explanation: "Paris is the capital and largest city of France.",
        points: 1
      },
      {
        question: "Which country is known as the 'Land of the Rising Sun'?",
        options: [
          "China",
          "Japan",
          "South Korea",
          "Thailand"
        ],
        correctAnswer: 1,
        explanation: "Japan is known as the 'Land of the Rising Sun' due to its location east of the Asian mainland.",
        points: 1
      },
      {
        question: "What is the capital of Spain?",
        options: [
          "Barcelona",
          "Madrid",
          "Seville",
          "Valencia"
        ],
        correctAnswer: 1,
        explanation: "Madrid is the capital and largest city of Spain.",
        points: 1
      },
      {
        question: "Which mountain range separates Europe from Asia?",
        options: [
          "Alps",
          "Ural Mountains",
          "Carpathians",
          "Pyrenees"
        ],
        correctAnswer: 1,
        explanation: "The Ural Mountains are considered the traditional boundary between Europe and Asia.",
        points: 1
      }
    ]
  },
  {
    title: "Natural Wonders & Landmarks",
    description: "Discover amazing natural wonders, landmarks, and geographical phenomena around the world.",
    category: "Geography",
    difficulty: "hard",
    timeLimit: 180,
    questions: [
      {
        question: "Which waterfall is the highest in the world?",
        options: [
          "Niagara Falls",
          "Victoria Falls",
          "Angel Falls",
          "Iguazu Falls"
        ],
        correctAnswer: 2,
        explanation: "Angel Falls in Venezuela is the world's highest uninterrupted waterfall at 979 meters.",
        points: 1
      },
      {
        question: "What is the deepest point in the world's oceans?",
        options: [
          "Mariana Trench",
          "Puerto Rico Trench",
          "Java Trench",
          "Tonga Trench"
        ],
        correctAnswer: 0,
        explanation: "The Mariana Trench in the Pacific Ocean is the deepest known point on Earth.",
        points: 1
      },
      {
        question: "Which desert is the largest in the world?",
        options: [
          "Sahara Desert",
          "Arabian Desert",
          "Gobi Desert",
          "Kalahari Desert"
        ],
        correctAnswer: 0,
        explanation: "The Sahara Desert is the largest hot desert in the world, covering much of North Africa.",
        points: 1
      },
      {
        question: "What is the highest mountain peak in the world?",
        options: [
          "K2",
          "Mount Everest",
          "Kangchenjunga",
          "Lhotse"
        ],
        correctAnswer: 1,
        explanation: "Mount Everest is the highest peak above sea level at 8,848 meters.",
        points: 1
      },
      {
        question: "Which country has the most time zones?",
        options: [
          "Russia",
          "United States",
          "China",
          "Brazil"
        ],
        correctAnswer: 0,
        explanation: "Russia spans 11 time zones, more than any other country.",
        points: 2
      }
    ]
  },
  // Science Category - 3 quizzes
  {
    title: "Science & Nature Quiz",
    description: "Test your knowledge of biology, chemistry, physics, and natural phenomena.",
    category: "Science",
    difficulty: "hard",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "What is the chemical symbol for gold?",
        options: [
          "Go",
          "Gd",
          "Au",
          "Ag"
        ],
        correctAnswer: 2,
        explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
        points: 1
      },
      {
        question: "Which planet is known as the 'Red Planet'?",
        options: [
          "Venus",
          "Mars",
          "Jupiter",
          "Saturn"
        ],
        correctAnswer: 1,
        explanation: "Mars is known as the Red Planet due to iron oxide on its surface.",
        points: 1
      },
      {
        question: "What is the speed of light in a vacuum?",
        options: [
          "300,000 km/s",
          "299,792,458 m/s",
          "186,000 miles/s",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "All of these are correct representations of the speed of light in different units.",
        points: 2
      },
      {
        question: "Which blood type is known as the 'universal donor'?",
        options: [
          "A+",
          "B+",
          "AB+",
          "O-"
        ],
        correctAnswer: 3,
        explanation: "O- blood type is the universal donor because it can be given to people with any blood type.",
        points: 1
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: [
          "Diamond",
          "Quartz",
          "Tungsten",
          "Steel"
        ],
        correctAnswer: 0,
        explanation: "Diamond is the hardest known natural material on Earth.",
        points: 1
      },
      {
        question: "Which gas makes up approximately 78% of Earth's atmosphere?",
        options: [
          "Oxygen",
          "Carbon Dioxide",
          "Nitrogen",
          "Argon"
        ],
        correctAnswer: 2,
        explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen is about 21%.",
        points: 1
      }
    ]
  },
  {
    title: "Biology & Life Sciences",
    description: "Explore the fascinating world of biology, anatomy, and life sciences.",
    category: "Science",
    difficulty: "medium",
    timeLimit: 180,
    questions: [
      {
        question: "What is the powerhouse of the cell?",
        options: [
          "Nucleus",
          "Mitochondria",
          "Ribosome",
          "Endoplasmic reticulum"
        ],
        correctAnswer: 1,
        explanation: "Mitochondria are known as the powerhouse of the cell because they produce ATP energy.",
        points: 1
      },
      {
        question: "How many chambers does a human heart have?",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        correctAnswer: 2,
        explanation: "The human heart has 4 chambers: 2 atria and 2 ventricles.",
        points: 1
      },
      {
        question: "What is the largest organ in the human body?",
        options: [
          "Liver",
          "Brain",
          "Skin",
          "Lungs"
        ],
        correctAnswer: 2,
        explanation: "The skin is the largest organ in the human body by surface area and weight.",
        points: 1
      },
      {
        question: "Which blood vessels carry blood away from the heart?",
        options: [
          "Veins",
          "Arteries",
          "Capillaries",
          "Venules"
        ],
        correctAnswer: 1,
        explanation: "Arteries carry oxygenated blood away from the heart to the body.",
        points: 1
      },
      {
        question: "What is the process by which plants make their own food?",
        options: [
          "Respiration",
          "Photosynthesis",
          "Digestion",
          "Fermentation"
        ],
        correctAnswer: 1,
        explanation: "Photosynthesis is the process by which plants convert sunlight into energy.",
        points: 1
      }
    ]
  },
  {
    title: "Chemistry & Physics Basics",
    description: "Test your understanding of basic chemistry and physics concepts.",
    category: "Science",
    difficulty: "easy",
    timeLimit: 180,
    questions: [
      {
        question: "What is the chemical symbol for water?",
        options: [
          "H2O",
          "H2O2",
          "HO",
          "H3O"
        ],
        correctAnswer: 0,
        explanation: "H2O is the chemical formula for water, consisting of 2 hydrogen atoms and 1 oxygen atom.",
        points: 1
      },
      {
        question: "What is the freezing point of water in Celsius?",
        options: [
          "0°C",
          "32°C",
          "100°C",
          "-1°C"
        ],
        correctAnswer: 0,
        explanation: "Water freezes at 0°C (32°F) at standard atmospheric pressure.",
        points: 1
      },
      {
        question: "Which force pulls objects toward the center of the Earth?",
        options: [
          "Magnetism",
          "Gravity",
          "Friction",
          "Inertia"
        ],
        correctAnswer: 1,
        explanation: "Gravity is the force that pulls objects toward the center of the Earth.",
        points: 1
      },
      {
        question: "What is the chemical symbol for oxygen?",
        options: [
          "Ox",
          "O",
          "O2",
          "Ox2"
        ],
        correctAnswer: 1,
        explanation: "O is the chemical symbol for oxygen, while O2 represents oxygen gas.",
        points: 1
      }
    ]
  },
  // History Category - 3 quizzes
  {
    title: "History Trivia",
    description: "Journey through time with questions about historical events, figures, and civilizations.",
    category: "History",
    difficulty: "medium",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "In which year did World War II end?",
        options: [
          "1944",
          "1945",
          "1946",
          "1947"
        ],
        correctAnswer: 1,
        explanation: "World War II ended in 1945 with the surrender of Japan.",
        points: 1
      },
      {
        question: "Who was the first person to walk on the moon?",
        options: [
          "Buzz Aldrin",
          "Neil Armstrong",
          "John Glenn",
          "Alan Shepard"
        ],
        correctAnswer: 1,
        explanation: "Neil Armstrong was the first person to walk on the moon on July 20, 1969.",
        points: 1
      },
      {
        question: "Which ancient wonder of the world was located in Alexandria?",
        options: [
          "Hanging Gardens of Babylon",
          "Lighthouse of Alexandria",
          "Colossus of Rhodes",
          "Temple of Artemis"
        ],
        correctAnswer: 1,
        explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World.",
        points: 1
      },
      {
        question: "Who painted the Mona Lisa?",
        options: [
          "Michelangelo",
          "Leonardo da Vinci",
          "Raphael",
          "Donatello"
        ],
        correctAnswer: 1,
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.",
        points: 1
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: [
          "Greek Empire",
          "Roman Empire",
          "Byzantine Empire",
          "Ottoman Empire"
        ],
        correctAnswer: 1,
        explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the Roman Republic.",
        points: 1
      }
    ]
  },
  {
    title: "Ancient Civilizations",
    description: "Explore the great ancient civilizations and their contributions to human history.",
    category: "History",
    difficulty: "hard",
    timeLimit: 180,
    questions: [
      {
        question: "Which ancient civilization built the Great Pyramid of Giza?",
        options: [
          "Mesopotamian",
          "Egyptian",
          "Greek",
          "Roman"
        ],
        correctAnswer: 1,
        explanation: "The Great Pyramid of Giza was built by the ancient Egyptians around 2580-2560 BC.",
        points: 1
      },
      {
        question: "What was the capital of the Aztec Empire?",
        options: [
          "Cuzco",
          "Tenochtitlan",
          "Machu Picchu",
          "Teotihuacan"
        ],
        correctAnswer: 1,
        explanation: "Tenochtitlan was the capital of the Aztec Empire, located where Mexico City stands today.",
        points: 1
      },
      {
        question: "Which ancient Greek city-state was known for its military prowess?",
        options: [
          "Athens",
          "Sparta",
          "Corinth",
          "Thebes"
        ],
        correctAnswer: 1,
        explanation: "Sparta was renowned for its military strength and warrior culture.",
        points: 1
      },
      {
        question: "What was the name of the ancient trade route connecting East and West?",
        options: [
          "Silk Road",
          "Amber Road",
          "Salt Road",
          "Spice Route"
        ],
        correctAnswer: 0,
        explanation: "The Silk Road was a network of trade routes connecting the East and West.",
        points: 1
      },
      {
        question: "Which ancient wonder was located in Babylon?",
        options: [
          "Hanging Gardens of Babylon",
          "Lighthouse of Alexandria",
          "Colossus of Rhodes",
          "Temple of Artemis"
        ],
        correctAnswer: 0,
        explanation: "The Hanging Gardens of Babylon were one of the Seven Wonders of the Ancient World.",
        points: 2
      }
    ]
  },
  {
    title: "Modern History & World Wars",
    description: "Test your knowledge of modern history, world wars, and recent historical events.",
    category: "History",
    difficulty: "easy",
    timeLimit: 180,
    questions: [
      {
        question: "In which year did World War I begin?",
        options: [
          "1912",
          "1914",
          "1916",
          "1918"
        ],
        correctAnswer: 1,
        explanation: "World War I began in 1914 with the assassination of Archduke Franz Ferdinand.",
        points: 1
      },
      {
        question: "Who was the President of the United States during World War II?",
        options: [
          "Harry Truman",
          "Franklin D. Roosevelt",
          "Dwight D. Eisenhower",
          "John F. Kennedy"
        ],
        correctAnswer: 1,
        explanation: "Franklin D. Roosevelt was President during most of World War II (1933-1945).",
        points: 1
      },
      {
        question: "What year did the Berlin Wall fall?",
        options: [
          "1987",
          "1989",
          "1991",
          "1993"
        ],
        correctAnswer: 1,
        explanation: "The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War.",
        points: 1
      },
      {
        question: "Which country was divided into East and West after World War II?",
        options: [
          "France",
          "Germany",
          "Italy",
          "Poland"
        ],
        correctAnswer: 1,
        explanation: "Germany was divided into East Germany (Soviet-controlled) and West Germany (Allied-controlled).",
        points: 1
      }
    ]
  },
  // Sports Category - 3 quizzes
  {
    title: "Sports Knowledge",
    description: "Test your knowledge of various sports, athletes, and sporting events.",
    category: "Sports",
    difficulty: "easy",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "How many players are on a basketball team on the court at one time?",
        options: [
          "4",
          "5",
          "6",
          "7"
        ],
        correctAnswer: 1,
        explanation: "A basketball team has 5 players on the court at one time.",
        points: 1
      },
      {
        question: "Which sport is played at Wimbledon?",
        options: [
          "Tennis",
          "Golf",
          "Cricket",
          "Rugby"
        ],
        correctAnswer: 0,
        explanation: "Wimbledon is the oldest tennis tournament in the world.",
        points: 1
      },
      {
        question: "In which year were the first modern Olympic Games held?",
        options: [
          "1896",
          "1900",
          "1904",
          "1908"
        ],
        correctAnswer: 0,
        explanation: "The first modern Olympic Games were held in Athens, Greece in 1896.",
        points: 1
      },
      {
        question: "Which country won the FIFA World Cup in 2018?",
        options: [
          "Germany",
          "Brazil",
          "France",
          "Argentina"
        ],
        correctAnswer: 2,
        explanation: "France won the 2018 FIFA World Cup, defeating Croatia 4-2 in the final.",
        points: 1
      }
    ]
  },
  {
    title: "Football & Soccer",
    description: "Test your knowledge of football (American) and soccer rules, teams, and players.",
    category: "Sports",
    difficulty: "medium",
    timeLimit: 180,
    questions: [
      {
        question: "How many players are on a soccer team on the field at one time?",
        options: [
          "10",
          "11",
          "12",
          "13"
        ],
        correctAnswer: 1,
        explanation: "A soccer team has 11 players on the field at one time, including the goalkeeper.",
        points: 1
      },
      {
        question: "What is the maximum number of substitutions allowed in a soccer match?",
        options: [
          "3",
          "5",
          "7",
          "Unlimited"
        ],
        correctAnswer: 1,
        explanation: "Most professional soccer matches allow up to 5 substitutions per team.",
        points: 1
      },
      {
        question: "Which country has won the most FIFA World Cups?",
        options: [
          "Germany",
          "Brazil",
          "Argentina",
          "Italy"
        ],
        correctAnswer: 1,
        explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).",
        points: 1
      },
      {
        question: "In American football, how many points is a touchdown worth?",
        options: [
          "6",
          "7",
          "8",
          "10"
        ],
        correctAnswer: 0,
        explanation: "A touchdown in American football is worth 6 points.",
        points: 1
      },
      {
        question: "What is the duration of a standard soccer match?",
        options: [
          "80 minutes",
          "90 minutes",
          "100 minutes",
          "120 minutes"
        ],
        correctAnswer: 1,
        explanation: "A standard soccer match consists of two 45-minute halves, totaling 90 minutes.",
        points: 1
      }
    ]
  },
  {
    title: "Olympic Games & Records",
    description: "Test your knowledge of Olympic history, records, and famous athletes.",
    category: "Sports",
    difficulty: "hard",
    timeLimit: 180,
    questions: [
      {
        question: "Which city hosted the 2016 Summer Olympics?",
        options: [
          "Tokyo",
          "Rio de Janeiro",
          "London",
          "Beijing"
        ],
        correctAnswer: 1,
        explanation: "Rio de Janeiro, Brazil hosted the 2016 Summer Olympics.",
        points: 1
      },
      {
        question: "Who is the most decorated Olympian of all time?",
        options: [
          "Michael Phelps",
          "Usain Bolt",
          "Larisa Latynina",
          "Carl Lewis"
        ],
        correctAnswer: 0,
        explanation: "Michael Phelps has won 28 Olympic medals (23 gold, 3 silver, 2 bronze).",
        points: 1
      },
      {
        question: "Which sport is NOT part of the Summer Olympics?",
        options: [
          "Swimming",
          "Figure Skating",
          "Track and Field",
          "Basketball"
        ],
        correctAnswer: 1,
        explanation: "Figure skating is a Winter Olympics sport, not Summer Olympics.",
        points: 1
      },
      {
        question: "What do the five Olympic rings represent?",
        options: [
          "Five continents",
          "Five sports",
          "Five years",
          "Five countries"
        ],
        correctAnswer: 0,
        explanation: "The five rings represent the five continents: Africa, Americas, Asia, Europe, and Oceania.",
        points: 1
      },
      {
        question: "Which country has hosted the most Summer Olympics?",
        options: [
          "United States",
          "Great Britain",
          "France",
          "Germany"
        ],
        correctAnswer: 0,
        explanation: "The United States has hosted the Summer Olympics 4 times (1904, 1932, 1984, 1996).",
        points: 2
      }
    ]
  },
  // Entertainment Category - 3 quizzes
  {
    title: "Movie & Entertainment",
    description: "Test your knowledge of movies, TV shows, music, and entertainment industry.",
    category: "Entertainment",
    difficulty: "medium",
    timeLimit: 180, // 3 minutes
    questions: [
      {
        question: "Which movie won the Academy Award for Best Picture in 2020?",
        options: [
          "Joker",
          "1917",
          "Parasite",
          "Once Upon a Time in Hollywood"
        ],
        correctAnswer: 2,
        explanation: "Parasite won the Academy Award for Best Picture in 2020, making history as the first non-English language film to win.",
        points: 1
      },
      {
        question: "Who directed the movie 'Inception'?",
        options: [
          "Steven Spielberg",
          "Christopher Nolan",
          "Martin Scorsese",
          "Quentin Tarantino"
        ],
        correctAnswer: 1,
        explanation: "Christopher Nolan directed Inception, released in 2010.",
        points: 1
      },
      {
        question: "Which streaming service produced 'Stranger Things'?",
        options: [
          "Hulu",
          "Amazon Prime",
          "Netflix",
          "Disney+"
        ],
        correctAnswer: 2,
        explanation: "Stranger Things is a Netflix original series created by the Duffer Brothers.",
        points: 1
      },
      {
        question: "Who composed the music for 'The Lord of the Rings' trilogy?",
        options: [
          "John Williams",
          "Hans Zimmer",
          "Howard Shore",
          "Danny Elfman"
        ],
        correctAnswer: 2,
        explanation: "Howard Shore composed the music for The Lord of the Rings trilogy.",
        points: 1
      },
      {
        question: "Which actor played Jack in 'Titanic'?",
        options: [
          "Brad Pitt",
          "Leonardo DiCaprio",
          "Tom Cruise",
          "Matt Damon"
        ],
        correctAnswer: 1,
        explanation: "Leonardo DiCaprio played Jack Dawson in the 1997 film Titanic.",
        points: 1
      }
    ]
  },
  {
    title: "Music & Pop Culture",
    description: "Test your knowledge of music, artists, albums, and pop culture trends.",
    category: "Entertainment",
    difficulty: "easy",
    timeLimit: 180,
    questions: [
      {
        question: "Which band is known for the song 'Bohemian Rhapsody'?",
        options: [
          "The Beatles",
          "Queen",
          "Led Zeppelin",
          "Pink Floyd"
        ],
        correctAnswer: 1,
        explanation: "Queen is the band that recorded 'Bohemian Rhapsody' in 1975.",
        points: 1
      },
      {
        question: "What is the best-selling album of all time?",
        options: [
          "Thriller by Michael Jackson",
          "The Dark Side of the Moon by Pink Floyd",
          "Abbey Road by The Beatles",
          "Back in Black by AC/DC"
        ],
        correctAnswer: 0,
        explanation: "Thriller by Michael Jackson is the best-selling album of all time with over 66 million copies sold.",
        points: 1
      },
      {
        question: "Which music streaming service was founded first?",
        options: [
          "Spotify",
          "Apple Music",
          "Pandora",
          "YouTube Music"
        ],
        correctAnswer: 2,
        explanation: "Pandora was founded in 2000, making it one of the earliest music streaming services.",
        points: 1
      },
      {
        question: "Who is known as the 'King of Pop'?",
        options: [
          "Elvis Presley",
          "Michael Jackson",
          "Prince",
          "Madonna"
        ],
        correctAnswer: 1,
        explanation: "Michael Jackson is known as the 'King of Pop' for his influence on popular music.",
        points: 1
      }
    ]
  },
  {
    title: "TV Shows & Streaming",
    description: "Test your knowledge of television shows, streaming series, and TV history.",
    category: "Entertainment",
    difficulty: "hard",
    timeLimit: 180,
    questions: [
      {
        question: "Which TV show holds the record for most Emmy Awards won?",
        options: [
          "Game of Thrones",
          "Saturday Night Live",
          "The Simpsons",
          "Breaking Bad"
        ],
        correctAnswer: 1,
        explanation: "Saturday Night Live has won over 80 Emmy Awards, more than any other TV show.",
        points: 1
      },
      {
        question: "What was the first scripted series produced by Netflix?",
        options: [
          "House of Cards",
          "Orange is the New Black",
          "Stranger Things",
          "The Crown"
        ],
        correctAnswer: 0,
        explanation: "House of Cards was Netflix's first original scripted series, premiering in 2013.",
        points: 1
      },
      {
        question: "Which TV show is known for the catchphrase 'How you doin'?'?",
        options: [
          "Seinfeld",
          "Friends",
          "The Office",
          "How I Met Your Mother"
        ],
        correctAnswer: 1,
        explanation: "Joey Tribbiani from Friends is famous for saying 'How you doin'?'",
        points: 1
      },
      {
        question: "What is the longest-running scripted primetime TV series in the US?",
        options: [
          "The Simpsons",
          "Law & Order: SVU",
          "Gunsmoke",
          "Grey's Anatomy"
        ],
        correctAnswer: 0,
        explanation: "The Simpsons is the longest-running scripted primetime TV series, airing since 1989.",
        points: 1
      },
      {
        question: "Which streaming platform is owned by Amazon?",
        options: [
          "Netflix",
          "Hulu",
          "Amazon Prime Video",
          "Disney+"
        ],
        correctAnswer: 2,
        explanation: "Amazon Prime Video is Amazon's streaming service, included with Prime membership.",
        points: 2
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find or create an admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@quizmaster.com',
        password: 'admin123', // In production, this should be hashed
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created');
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Create sample quizzes
    const quizzes = sampleQuizzes.map(quizData => {
      const totalPoints = quizData.questions.reduce((total, question) => total + (question.points || 1), 0);
      return {
        ...quizData,
        createdBy: adminUser._id,
        totalQuestions: quizData.questions.length,
        totalPoints: totalPoints
      };
    });

    await Quiz.insertMany(quizzes);
    console.log(`Created ${quizzes.length} sample quizzes`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
