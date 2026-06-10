export function summarizeBy(items, key) {
  const map = new Map();

  items.forEach((item) => {
    const value = item[key] || "Unknown";
    map.set(value, (map.get(value) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, value]) => {
      return { name, value };
    })
    .sort((a, b) => b.value - a.value);
}

export function groupConversations(messages) {
  const map = new Map();

  messages.forEach((message) => {
    const id = message.conversationId || "unknown";

    if (!map.has(id)) {
      map.set(id, []);
    }

    map.get(id).push(message);
  });

  return Array.from(map.entries()).map(([id, thread]) => {
    const outgoing = thread.filter((item) => {
      return item.direction === "outgoing";
    }).length;

    const incoming = thread.filter((item) => {
      return item.direction === "incoming";
    }).length;

    return {
      id,
      title:
        thread[0]?.title ||
        thread[0]?.from ||
        thread[0]?.to ||
        "Untitled Conversation",
      messages: thread,
      messageCount: thread.length,
      outgoing,
      incoming,
      status:
        outgoing && incoming
          ? "Two-way"
          : outgoing
            ? "Only Outgoing"
            : incoming
              ? "Only Incoming"
              : "Unknown"
    };
  });
}

export function getConversationText(conversation) {
  return (conversation.messages || [])
    .map((item) => item.content || "")
    .join(" ");
}

export function buildCompanyMap(connections) {
  const map = new Map();

  connections.forEach((connection) => {
    const company = connection.company || "Unknown";

    if (!map.has(company)) {
      map.set(company, []);
    }

    map.get(company).push(connection);
  });

  return Array.from(map.entries())
    .map(([company, people]) => {
      const averageScore = people.length
        ? Math.round(
            people.reduce((sum, person) => {
              return sum + person.priorityScore;
            }, 0) / people.length
          )
        : 0;

      const recruiters = people.filter((person) => {
        return person.domain === "Recruiter / HR";
      }).length;

      const mentors = people.filter((person) => {
        return person.relationshipType === "Mentor Potential";
      }).length;

      return {
        company,
        people,
        count: people.length,
        averageScore,
        recruiters,
        mentors
      };
    })
    .sort((a, b) => {
      return b.count - a.count || b.averageScore - a.averageScore;
    });
}

export function getPipelineColumns(connections, conversations) {
  const messageText = conversations
    .map((conversation) => getConversationText(conversation).toLowerCase())
    .join(" ");

  return [
    [
      "Not Contacted",
      connections
        .filter((connection) => {
          return !messageText.includes(
            String(connection.fullName || "").toLowerCase()
          );
        })
        .slice(0, 12)
    ],

    [
      "High Priority",
      connections
        .filter((connection) => {
          return connection.priorityScore >= 75;
        })
        .slice(0, 12)
    ],

    [
      "Mentor Potential",
      connections
        .filter((connection) => {
          return connection.relationshipType === "Mentor Potential";
        })
        .slice(0, 12)
    ],

    [
      "Recruiters",
      connections
        .filter((connection) => {
          return connection.domain === "Recruiter / HR";
        })
        .slice(0, 12)
    ]
  ];
}

export function getMentorList(connections) {
  return connections
    .filter((connection) => {
      return (
        connection.relationshipType === "Mentor Potential" ||
        connection.domain === "Academia / Research" ||
        connection.domain === "Founder / Startup"
      );
    })
    .sort((a, b) => {
      return b.priorityScore - a.priorityScore;
    });
}

export function getNetworkMetrics(connections, conversations, messages) {
  const companies = new Set(
    connections
      .map((connection) => connection.company)
      .filter(Boolean)
  );

  const high = connections.filter((connection) => {
    return connection.priorityScore >= 75;
  }).length;

  const recruiters = connections.filter((connection) => {
    return connection.domain === "Recruiter / HR";
  }).length;

  const mentors = connections.filter((connection) => {
    return connection.relationshipType === "Mentor Potential";
  }).length;

  const emails = connections.filter((connection) => {
    return connection.email;
  }).length;

  const twoWay = conversations.filter((conversation) => {
    return conversation.status === "Two-way";
  }).length;

  const replyRate = conversations.length
    ? Math.round((twoWay / conversations.length) * 100)
    : 0;

  return {
    companies: companies.size,
    high,
    recruiters,
    mentors,
    emails,
    twoWay,
    replyRate,
    messages: messages.length
  };
}

export function copilotAnswer(query, connections, profileAudit) {
  const q = String(query || "").toLowerCase();

  if (!q.trim()) {
    return "Ask something like: show recruiters, show mentors, show Amazon contacts, create 7 day plan, profile suggestions.";
  }

  if (q.includes("recruit")) {
    const list = connections
      .filter((connection) => connection.domain === "Recruiter / HR")
      .slice(0, 8);

    return list.length
      ? "Recruiter contacts: " +
          list
            .map((contact) => {
              return contact.fullName + " at " + (contact.company || "unknown");
            })
            .join("; ")
      : "No recruiter contacts found yet.";
  }

  if (q.includes("mentor")) {
    const list = connections
      .filter((connection) => {
        return connection.relationshipType === "Mentor Potential";
      })
      .slice(0, 8);

    return list.length
      ? "Mentor candidates: " +
          list
            .map((contact) => {
              return contact.fullName + " — " + contact.position;
            })
            .join("; ")
      : "No mentor candidates found yet.";
  }

  if (q.includes("founder") || q.includes("startup")) {
    const list = connections
      .filter((connection) => connection.domain === "Founder / Startup")
      .slice(0, 8);

    return list.length
      ? "Founder/startup contacts: " +
          list
            .map((contact) => {
              return contact.fullName + " at " + (contact.company || "unknown");
            })
            .join("; ")
      : "No founder/startup contacts found yet.";
  }

  if (q.includes("ai") || q.includes("data")) {
    const list = connections
      .filter((connection) => {
        return (
          connection.domain === "AI / ML" ||
          connection.domain === "Data Science"
        );
      })
      .slice(0, 8);

    return list.length
      ? "AI/Data contacts: " +
          list
            .map((contact) => {
              return contact.fullName + " — " + contact.position;
            })
            .join("; ")
      : "No AI/Data contacts found yet.";
  }

  if (
    q.includes("amazon") ||
    q.includes("google") ||
    q.includes("microsoft") ||
    q.includes("deloitte")
  ) {
    const word = q.includes("amazon")
      ? "amazon"
      : q.includes("google")
        ? "google"
        : q.includes("microsoft")
          ? "microsoft"
          : "deloitte";

    const list = connections
      .filter((connection) => {
        return String(connection.company || "")
          .toLowerCase()
          .includes(word);
      })
      .slice(0, 10);

    return list.length
      ? "Company matches: " +
          list
            .map((contact) => {
              return contact.fullName + " — " + contact.position;
            })
            .join("; ")
      : "No contacts found for that company.";
  }

  if (q.includes("profile") || q.includes("suggest")) {
    return (
      "Profile score: " +
      profileAudit.score +
      ". Suggestions: " +
      profileAudit.suggestions.slice(0, 4).join(" ")
    );
  }

  if (q.includes("7") || q.includes("plan")) {
    return "7-day plan: Day 1 profile cleanup. Day 2 message 2 seniors. Day 3 message 2 SDE/Data contacts. Day 4 follow up one warm conversation. Day 5 post one learning update. Day 6 review replies. Day 7 update pipeline and next targets.";
  }

  return "I can answer about recruiters, mentors, founders, AI/Data contacts, company contacts, profile suggestions, and 7-day networking plans.";
}