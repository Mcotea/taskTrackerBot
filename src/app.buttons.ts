import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📋Список задач', 'list'),
      Markup.button.callback('➕Создать задачу', 'create'),
      Markup.button.callback('✏️Отредактировать задачу', 'edit'),
      Markup.button.callback('🗑Удалить задачу', 'remove'),
      Markup.button.callback('✅Завершить задачу', 'done'),
    ],
    {
      columns: 2,
    },
  );
}

export function editButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📖Поменять название', 'edit name'),
      Markup.button.callback('#️⃣Поменять категорию', 'edit tag'),
      Markup.button.callback('⏳Поменять дедлайн', 'edit deadline'),
      Markup.button.callback('🔙Назад', 'back'),
    ],
    {
      columns: 3,
    },
  );
}
