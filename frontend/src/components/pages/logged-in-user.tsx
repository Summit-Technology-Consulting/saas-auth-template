import { fetch } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CreditCard,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./logged-in-user.module.css";

type LoggedInResponse = {
  username: string;
};

export const LoggedInUser = () => {
  const [username, setUsername] = useState("");

  const getUsername = async () => {
    const response = await fetch<LoggedInResponse>("/requires-auth");

    if (response) {
      setUsername(response.username);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+20%",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Active Projects",
      value: "23",
      change: "+5%",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      value: "98%",
      change: "+2%",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeContainer}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {username}! 👋
            </h1>
            <p className={styles.welcomeDescription}>
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.title} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3 className={styles.statTitle}>{stat.title}</h3>
                  <div className={styles.statIcon}>{stat.icon}</div>
                </div>
                <div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <p className={styles.statChange}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.actionsSection}>
        <div className={styles.actionsContainer}>
          <h2 className={styles.actionsTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <div className={styles.actionHeader}>
                <Settings
                  className={`${styles.actionIcon} ${styles.actionIconBlue}`}
                />
                <h3 className={styles.actionTitle}>Account Settings</h3>
              </div>
              <p className={styles.actionDescription}>
                Manage your profile, billing, and preferences
              </p>
              <Link href="/settings">
                <button className={styles.actionButton}>
                  Go to Settings
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionHeader}>
                <BarChart3
                  className={`${styles.actionIcon} ${styles.actionIconGreen}`}
                />
                <h3 className={styles.actionTitle}>View Analytics</h3>
              </div>
              <p className={styles.actionDescription}>
                Check your performance metrics and insights
              </p>
              <button className="w-full">
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionHeader}>
                <Users
                  className={`${styles.actionIcon} ${styles.actionIconPurple}`}
                />
                <h3 className={styles.actionTitle}>Team Management</h3>
              </div>
              <p className={styles.actionDescription}>
                Invite team members and manage permissions
              </p>
              <button className={styles.actionButton}>
                Manage Team
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.activitySection}>
        <div className={styles.activityContainer}>
          <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
              <h3 className={styles.activityTitle}>Recent Activity</h3>
              <p className={styles.activityDescription}>
                Your latest actions and updates
              </p>
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityList}>
                {[
                  {
                    action: "Updated profile settings",
                    time: "2 hours ago",
                    type: "settings",
                  },
                  {
                    action: "Created new project",
                    time: "1 day ago",
                    type: "project",
                  },
                  {
                    action: "Invited team member",
                    time: "2 days ago",
                    type: "team",
                  },
                  {
                    action: "Upgraded subscription",
                    time: "1 week ago",
                    type: "billing",
                  },
                ].map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityDot}></div>
                      <span className={styles.activityText}>
                        {activity.action}
                      </span>
                    </div>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
