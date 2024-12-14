import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createQuestionCollection from "./question.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    //if no prblems then db connected succesfully
    await databases.get(db);
    console.log("Database Connected");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    try {
      //if db not created then creating...
      await databases.create(db, db);
      console.log("Database Created");
      // creating collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("Collection created Succesfully");
      console.log("Database Connected");
    } catch (error) {
      console.log("Error happened at: ", error);
    }
  }
  // at last return the databases
  return databases
}
