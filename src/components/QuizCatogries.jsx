import {
    Grid,
    Paper,
    Select,
    Button,
    MenuItem,
    TextField,
    Container,
    Typography,
    InputLabel,
    FormControl,
    makeStyles,
  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "20px",
    marginTop: "20px",
    marginBottom: "20px",
    borderRadius: "20px",
    boxShadow: "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
},
mainTitle: {
    fontSize: "45px",
    marginBottom:"20px"
},
submitButton: {
    marginTop: "20px",
    borderRadius: "999px",
    background: "blue",
    "&:hover": {
      backgroundColor: "grey",
      boxShadow: "0 14px 26px -12px rgba(156, 39, 176, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(156, 39, 176, 0.2)",
    }
}
}));
  


const QuizCatogries = () => {
    const [catogries, setCatogries] = useState([]);
    const fetchQuizCatogries = async () => {
    const {data} = await axios.get(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy"
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
    setCatogries(formattedData);
    };

    useEffect(() => {
    fetchQuizCatogries();
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      
    }


    console.log({catogries});
    return (
    <Container>
    <Paper className={classes.paper}>
    <Typography variant="h1" className={classes.mainTitle}>
    Get Questions:
    </Typography>
    <form onSubmit={handleSubmit}>
    <Grid container spacing={4}>
    <Grid item xs={12}>
    <FormControl fullWidth variant="outlined">
    <InputLabel id="category-select-label">
    Select category:
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
    {categories.map((category) => (
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
                      required
                      name="difficulty"
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
            </form>
            </Paper>
            </Container>
    
    );
};

export default QuizCatogries;

