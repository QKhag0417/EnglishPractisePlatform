export type ExercisePrompt = {
  id: string;
  task: number;
  duration: number;
  audioUrl: string;
  examText: string;
};

export const mockExercisePrompt1: ExercisePrompt = {
  id: "1",
  task: 1,
  duration: 12,
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  examText: `
Complete the table below.

[table]
  [row][cell]Name[/cell][cell][gap:1][/cell][/row]
  [row][cell]Course[/cell][cell][gap:2][/cell][/row]
[/table]

Look at the image.

[img src="https://www.gstatic.com/webp/gallery3/1.png" alt="Sample photo" width="240"]

Choose ONE answer.

[multiple-choice n="3" pick="1"]
[option key="A"]Dog[/option]
[option key="B"]Cat[/option]
[option key="C"]Bird[/option]
[option key="D"]Bird[/option]
[/multiple-choice]

Choose [f weight="700" style="italic" color="blue" size="16"]TWO[/f] answers.

[multiple-choice n="4" pick="2"]
[option key="A"]Bus[/option]
[option key="B"]Train[/option]
[option key="C"]Taxi[/option]
[option key="D"]Bicycle[/option]
[/multiple-choice]
`.trim(),
};
