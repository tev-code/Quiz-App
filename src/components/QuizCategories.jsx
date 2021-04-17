import {
    Grid,
    Paper,
    Select,
    Button,
    MenuItem,
    TextField,
    Container,
    InputLabel,
    FormControl,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {useEffect, useState} from "react";
import axios from "axios";
import QuizAnswers from './QuizAnswers';
import { createMarkup, difficulties, styles} from '../helpers';



const useStyles = makeStyles((theme) => {
return styles;
});
  


const QuizCategories = () => {
    const [quizData, setQuizData] = useState([]);
    const [quizCategories, setQuizCategories] = useState([]);

    const [category, setCategory] = useState({id: "", name: ""});

    const [quizNumber, setQuizNumber] = useState(null);
    const [difficulty, setDifficulty] = useState({});

    const [currentQuizStep, setCurrentQuizStep] = useState("start");
    

    const classes = useStyles();


    const fetchCategories = async () => {
    const {data} = await axios.get(
    `https://opentdb.com/api.php?amount=${quizNumber}&category=${category.id}&difficulty=${difficulty.name.toLowerCase()}`
    );
    const formattedData = data.results.map((category) => {
    const incorrectAnswersIndexes = category.incorrect_answers.length;
    const randomIndex = Math.random() * (incorrectAnswersIndexes - 0) + 0;
    category.incorrect_answers.splice(
    randomIndex,
    0,
    category.correct_answer
    );
    return {
    ...category,
    answers: category.incorrect_answers,
    };
    });
    setCurrentQuizStep("results");
    setQuizData(formattedData);
    };

   const fetchQuizCategories = async () => {
     const {data} = await axios.get("https://opentdb.com/api_category.php");
     setQuizCategories(data.trivia_categories);
   };

    useEffect(() => {
      fetchQuizCategories();
      }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!quizData.length && quizNumber && category.id && difficulty.name) {
        fetchCategories();
      }
       
    };

    const handleSelectChange = (e) => {
      e.preventDefault();
      const selectedCategory = quizCategories.find(
      (cat) => cat.id === e.target.value
      );
      setCategory(selectedCategory);
    };

    const handleDifficultyChange = (e) => {
      e.preventDefault();
      const selectedDifficulty = difficulties.find(
      (diff) => diff.id === e.target.value 
      );
      setDifficulty(selectedDifficulty);
    };

    const handleChange = (e) => {
    e.preventDefault();
    setQuizNumber(e.target.value);
    };

    const resetQuiz = (e) => {
    e.preventDefault();
    setQuizData([]);
    setCategory("");
    setQuizNumber("");
    setDifficulty("");
    setCurrentQuizStep("start");
    window.scrollTo(0, "20px");
    };

    
    
    return (
    <Container>
    <Paper className={classes.paper}>
    {currentQuizStep === "start" ?(
    <>

     <Typography variant="h1" className={classes.mainTitle}>
     GET QUESTIONS
    </Typography>

    
    <form onSubmit={handleSubmit}> 
    <Grid container spacing={4}>
    <Grid item xs={12}>
    <FormControl fullWidth variant="outlined">
    <InputLabel id="category-select-label">
    Select Category:
    </InputLabel>
    <Select
    required
    name="category"
    value={category.id || ""}
    id="category-select"
    label="Select category"
    labelId="category-select-label"
    onChange={handleSelectChange}
    >
    {quizCategories.map((category) => (
    <MenuItem key={category.id} value={category.id}>
    <span
    dangerouslySetInnerHTML={createMarkup(
    category.name
    )}
    />
    </MenuItem>
    ))}
    </Select>
   </FormControl>
   </Grid>
   <Grid item xs={12}>
   <FormControl fullWidth variant="outlined">
   <InputLabel id="difficulty-select-label">
    Select Difficulty:
   </InputLabel>
   <Select
    required name="difficulty"
    value={difficulty.id || ""}
    id="difficulty-select"
    label="Select Difficulty"
    labelId="difficulty-select-label"
    onChange={handleDifficultyChange}
    >
    {difficulties.map((difficulty) => (
    <MenuItem key={difficulty.id} value={difficulty.id}>
    {difficulty.name}
    </MenuItem>
    ))}
    </Select>
    </FormControl>
    </Grid>
    <Grid item xs={12}>
    <TextField
     inputProps={{ min: 1, max: 10 }}
     required
     fullWidth
     type="number"
     id="quiz-number"
     variant="outlined"
     name="quiz-number"
     label={`Add a quiz number from 1 to 10`}
     value={quizNumber || ""}
     onChange={handleChange}
     />
    </Grid>
    </Grid>
    <Button
    className={classes.submitButton}
    type="submit"
    variant="contained"
    color="primary"
    >
    Submit
    </Button>
    </form>{""} 
    </> 
    ):( <QuizAnswers
        quizData={quizData}
        classes={classes} 
        setCurrentQuizStep={setCurrentQuizStep}
        resetQuiz={resetQuiz}
        currentQuizStep={currentQuizStep}/>
    )}
    </Paper>
    </Container>
    
    );
};

export default QuizCategories;

