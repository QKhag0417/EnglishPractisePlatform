import { ListeningExercise, ReadingExercise } from "../types";

export const mockListeningExercisePrompt: ListeningExercise = {
  id: "1",
  skill: "listening",
  task: 1,
  duration: 12,
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  examText: `
Questions 1–2
Complete the table below.

[table]
  [row][cell]Name[/cell][cell][gap:1][/cell][/row]
  [row][cell]Course[/cell][cell][gap:2][/cell][/row]
[/table]

Question 3
Look at the image.

[img src="https://www.gstatic.com/webp/gallery3/1.png" alt="Sample photo" width="240"]

Choose ONE answer.

[multiple-choice n="3" pick="1"]
[option key="A"]Dog[/option]
[option key="B"]Cat[/option]
[option key="C"]Bird[/option]
[option key="D"]Fish[/option]
[/multiple-choice]

Question 4
Choose TWO answers.

[multiple-choice n="4" pick="2"]
[option key="A"]Bus[/option]
[option key="B"]Train[/option]
[option key="C"]Taxi[/option]
[option key="D"]Bicycle[/option]
[/multiple-choice]

Question 5
Read the statement and choose ONE answer.

Statement: The course starts next Monday.

[multiple-choice n="5" pick="1"]
[option key="TRUE"][/option]
[option key="FALSE"][/option]
[option key="Not Given"][/option]
[/multiple-choice]
`.trim(),
  totalQuestions: 5,
};

export const mockReadingExercisePrompt: ReadingExercise = {
  id: "2",
  skill: "reading",
  task: 1,
  duration: 18,
  passageText: `
Urban gardening has grown rapidly over the past decade as more people move into cities and look for ways to produce fresh food locally. Rooftops, balconies, and small community plots are being transformed into green spaces that provide vegetables, herbs, and even fruit. Supporters say these gardens not only improve access to healthy food, but also reduce the “food miles” required to transport produce from rural farms to urban supermarkets.

However, growing food in cities can be challenging. Space is limited, sunlight may be blocked by tall buildings, and soil quality is not always reliable. For this reason, many urban gardeners use raised beds filled with clean soil, or hydroponic systems that grow plants in water rather than in the ground. City governments in some places have started to support these projects by offering grants, training, and permission to use unused land.

Researchers have found that urban gardens can strengthen communities. People who share a garden often exchange advice, tools, and seeds. In addition, green areas can lower local temperatures in summer and provide habitats for insects and birds. Although urban gardening will not replace large-scale farming, it can be an important part of a more resilient food system.
`.trim(),
  examText: `
Questions 1–2
Complete the table below.

[table]
  [row][cell]Location[/cell][cell][gap:1][/cell][/row]
  [row][cell]Main challenge[/cell][cell][gap:2][/cell][/row]
[/table]

Question 3
Choose ONE answer.

[multiple-choice n="3" pick="1"]
[option key="A"]Urban gardening has decreased because cities are expanding.[/option]
[option key="B"]Urban gardening can help reduce the distance food travels.[/option]
[option key="C"]Urban gardening has replaced large-scale farming in many countries.[/option]
[option key="D"]Urban gardening is only possible using hydroponics.[/option]
[/multiple-choice]

Question 4
Choose TWO answers.

[multiple-choice n="4" pick="2"]
[option key="A"]Limited space can make urban gardening difficult.[/option]
[option key="B"]Tall buildings can reduce sunlight for plants.[/option]
[option key="C"]Hydroponic systems always cost less than raised beds.[/option]
[option key="D"]City governments never support urban gardening projects.[/option]
[/multiple-choice]

Question 5
Read the statement and choose ONE answer.

Statement: Urban gardening can help build stronger communities.

[multiple-choice n="5" pick="1"]
[option key="TRUE"][/option]
[option key="FALSE"][/option]
[option key="Not Given"][/option]
[/multiple-choice]
`.trim(),
  totalQuestions: 5,
};
