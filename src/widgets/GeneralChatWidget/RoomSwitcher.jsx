import React, { useState } from 'react';
import {
  Card, Button, Icon,
} from '@openedx/paragon';
import {
  Forum, HelpOutline, Code,
} from '@openedx/paragon/icons';
import {
  CHAT_ROOMS,
  getCurrentRoom,
  setCurrentRoom,
  getCurrentRoomInfo,
} from 'services/firebase/chatRooms';

/**
 * RoomSwitcher - Component to switch between different chat rooms
 * Allows users to navigate between: Chung, Hỏi&Đáp, Kỹ thuật
 * Shows unread message badges for admin/staff
 */
const RoomSwitcher = ({ onRoomChange, unreadCounts = {}, isStaffOrAdmin = false }) => {
  const [currentRoomId, setCurrentRoomId] = useState(getCurrentRoom());
  const currentRoomInfo = getCurrentRoomInfo();

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Forum':
        return Forum;
      case 'HelpOutline':
        return HelpOutline;
      case 'Code':
        return Code;
      default:
        return Forum;
    }
  };

  const handleRoomSwitch = (roomId) => {
    if (roomId === currentRoomId) {
      return;
    }

    const success = setCurrentRoom(roomId);
    if (success) {
      setCurrentRoomId(roomId);
      // Notify parent component to reload messages
      if (onRoomChange) {
        onRoomChange(roomId);
      }
    }
  };

  return (
    <Card className="room-switcher-card mb-2">
      <Card.Body className="p-2">
        <div className="d-flex align-items-center mb-2">
          <Icon
            src={getIconComponent(currentRoomInfo.icon)}
            className="mr-2"
            style={{ fontSize: '1.25rem' }}
          />
          <span className="font-weight-bold" style={{ fontSize: '0.875rem' }}>
            {currentRoomInfo.name}
          </span>
        </div>

        <div className="room-buttons">
          <div className="btn-group btn-group-sm w-100" role="group">
            {Object.values(CHAT_ROOMS).map((room) => {
              const IconComponent = getIconComponent(room.icon);
              const isActive = currentRoomId === room.id;
              const unreadCount = unreadCounts[room.id] || 0;
              const showBadge = isStaffOrAdmin && !isActive && unreadCount > 0;

              return (
                <Button
                  key={room.id}
                  variant={isActive ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleRoomSwitch(room.id)}
                  disabled={isActive}
                  className="flex-fill room-button-with-badge"
                  title={room.description}
                >
                  <div className="d-flex align-items-center justify-content-center position-relative">
                    <Icon
                      src={IconComponent}
                      className="mr-1"
                      style={{ fontSize: '0.875rem' }}
                    />
                    <span style={{ fontSize: '0.75rem' }}>{room.name}</span>
                    {showBadge && (
                      <span className="unread-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mt-2">
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
            {currentRoomInfo.description}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoomSwitcher;
