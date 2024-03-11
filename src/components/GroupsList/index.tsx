import { Div, SimpleCell, Title } from "@vkontakte/vkui";
import { CustomModal } from "../CustomModal";
import { Group, User } from "../../utils/InterfaceApiGroups";
import styles from './styles.module.css';

interface OpenModalProps {
  friends: User[] | undefined, 
  groupName: string
}

interface GroupsListProps {
  groupsData: Group[],
  setActivePanel: () => void,
  isOpen: boolean,
  onClose: () => void,
  friendsData: User[] | undefined,
  groupName: string,
  openModal: ({friends, groupName}: OpenModalProps) => void
}

export default function GroupsList({
  groupsData, 
  setActivePanel,
  isOpen, 
  onClose, 
  friendsData, 
  groupName, 
  openModal
}: GroupsListProps) 
  {
    return (
      <div>
        {groupsData.map((item: Group) => (
          <Div key={item.id} className={styles.group}>
            <SimpleCell before={<div className={styles["group__avatar"] + " " + (item.avatar_color ? "" : styles["group__avatar_none"])} style={item.avatar_color ? {backgroundColor: item.avatar_color} : {}}></div>}></SimpleCell>
            <Title level="1" className={styles["group__title"]}>{item.name}</Title>
            <SimpleCell
              onClick={setActivePanel}
              expandable="auto"
            >
              Доступность группы: {item.closed ? "Закрытая" : "Открытая"}
            </SimpleCell>
            <SimpleCell
              onClick={setActivePanel}
              expandable="auto"
            >
              Количество подписчиков: {item.members_count}
            </SimpleCell>

            <div>
              <button
                onClick={() => openModal({ friends: item.friends, groupName: item.name })}
                className={styles["group__friend-button"]}
              >
                Количество друзей: {item.friends?.length || 0}
              </button>
              <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                friendsData={friendsData}
                groupName={groupName}
              />
            </div>
          </Div>
        ))}
      </div>
    )
}