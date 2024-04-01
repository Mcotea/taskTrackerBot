export const showList = (todos) =>
  `Текущий список задач: \n\n${todos
    .map(
      (todo) =>
        todo.id +
        '. ' +
        ' ' +
        (todo.isCompleted ? '✅' : '🔁') +
        ' ' +
        todo.name +
        '\n' +
        'Категория: ' +
        todo.tag +
        '\n' +
        'Дедлайн: ' +
        todo.deadline +
        '\n\n',
    )
    .join('')}`;
