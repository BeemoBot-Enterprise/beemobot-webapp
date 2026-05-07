"use client";

import * as React from "react";
import type { ComponentPropsWithoutRef } from "react";
import * as Notification from "@/components/ui/notification";

type NotificationProps = ComponentPropsWithoutRef<typeof Notification.Root> & {
  id: string;
};

type NotifyArgs = Omit<NotificationProps, "id">;

type Ctx = {
  notifications: NotificationProps[];
  notify: (args: NotifyArgs) => string;
  dismiss: (id: string) => void;
};

const NotificationContext = React.createContext<Ctx | null>(null);

export const NotificationProviderShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>(
    [],
  );

  const notify = React.useCallback((args: NotifyArgs) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { ...args, id }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = React.useContext(NotificationContext);
  if (!ctx) {
    return {
      notifications: [] as NotificationProps[],
      notify: (() => "") as Ctx["notify"],
      dismiss: (() => {}) as Ctx["dismiss"],
    };
  }
  return ctx;
};
