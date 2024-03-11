import { ChangeEvent, useState } from "react";
import styles from './styles.module.css';

interface FiltersProps {
  onFilterChange: (filters: FiltersState) => void;
  colorAvatarList: string[];
}

interface FiltersState {
  privacyType: string;
  avatarColor: string;
  friendCount: string;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange, colorAvatarList }) => {

  const [privacyType, setPrivacyType] = useState("all");
  const [avatarColor, setAvatarColor] = useState("all");
  const [friendCount, setFriendCount] = useState("");

  const handlePrivacyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setPrivacyType(value);
    onFilterChange({ privacyType: value, avatarColor, friendCount });
  };

  const handleAvatarColorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setAvatarColor(value);
    onFilterChange({ privacyType, avatarColor: value, friendCount });
  };

  const handleFriendCountOrderChange = (event: ChangeEvent<HTMLSelectElement>) => { // Обработчик для изменения порядка сортировки
    const { value } = event.target;
    setFriendCount(value);
    onFilterChange({ privacyType, avatarColor, friendCount: value });
  };

  return (
    <div className={styles.filter}>
      <label className={styles.label}>
        Тип приватности:
        <select value={privacyType} onChange={handlePrivacyChange} className={styles.select}>
          <option value="all">Все</option>
          <option value="closed">Закрытые</option>
          <option value="open">Открытые</option>
        </select>
      </label>

      <label className={styles.label}>
        Цвет фото:
        <select value={avatarColor} onChange={handleAvatarColorChange} className={styles.select}>
          <option value="all">Все</option>
          {colorAvatarList.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Количество друзей:
        <select value={friendCount} onChange={handleFriendCountOrderChange} className={styles.select}>
          <option value="increase">По возрастанию</option>
          <option value="decrease">По уменьшению</option>
        </select>
      </label>

    </div>
  );
};

export default Filters;