export default {
    global: {
        cancel: 'Cancel',
        remove: 'Remove',
        save: 'Save',
        add: 'Add',
        abstract: 'Abstract',
        doi: 'DOI',
        tags: 'Tags',
        openScienceFramework: 'Open Science Framework',
        title: 'Title',
        authors: 'Authors',
        license: 'License',
        none: 'None',
        settings: 'Settings',
        moderation: 'Moderation',
        notifications: 'Notifications',
        submissions: 'Submissions',
        moderators: 'Moderators',
    },
    documentType: {
        default: {
            plural: 'documents',
            pluralCapitalized: 'Documents',
            singular: 'document',
            singularCapitalized: 'Document',
        },
        paper: {
            plural: 'papers',
            pluralCapitalized: 'Papers',
            singular: 'paper',
            singularCapitalized: 'Paper',
        },
        preprint: {
            plural: 'preprints',
            pluralCapitalized: 'Preprints',
            singular: 'preprint',
            singularCapitalized: 'Preprint',
        },
        none: {
            plural: '',
            pluralCapitalized: '',
            singular: '',
            singularCapitalized: '',
        },
        thesis: {
            plural: 'theses',
            pluralCapitalized: 'Theses',
            singular: 'thesis',
            singularCapitalized: 'Thesis',
        },
    },
    index: {
        feature: {
            title: 'Moderate your collection',
            description: `At last, the ability to manage what scholarly works are displayed with your branding.
            No more working on off-topic papers confusing loyal researchers.`,
            list1: 'See all submissions in one place.',
            list2: 'Provide feedback to authors.',
            list3: 'Manage collections settings.',
        },
        workflow: {
            title: 'Choose your workflow',
            list1: 'Have greater control over what material is publicly available by choosing pre-moderation.',
            list2: 'Keep the time delay between submission and public access minimal by choosing post-moderation.',
            figure: {
                preModeration: 'Pre-moderation',
                postModeration: 'Post-moderation',
            },
        },
    },
    moderators: {
        addNewMod: 'Add new moderator',
        getStartedIntro: 'Get started by',
        getStartedAction: 'adding a new moderator!',
        deleteModeratorError: 'Error removing moderator.',
        updateModeratorError: 'Error saving moderator',
        addModeratorError: 'Error adding moderator',
        name: 'Name',
        permissions: 'Permissions',
    },
    providerSettings: {
        reviewsWorkflow: {
            title: 'Moderation Type',
            description: '',
            options: {
                'pre-moderation': {
                    title: 'Pre-moderation',
                    description: 'All {{documentType.plural}} are placed in a queue for a moderator to accept or reject. {{documentType.pluralCapitalized}} are displayed publicly only after approval.',
                },
                'post-moderation': {
                    title: 'Post-moderation',
                    description: 'All {{documentType.plural}} are displayed publicly immediately upon submission. {{documentType.pluralCapitalized}} also appear in a queue for a moderator to accept or reject. If rejected, the {{documentType.singular}} is no longer displayed publicly.',
                },
            },
        },
        reviewsCommentsPrivate: {
            title: 'Comment Visibility',
            description: 'Moderators can add comments when making a decision about a submission.',
            options: {
                true: {
                    title: 'Moderators',
                    description: 'Comments will be visible to {{provider.name}} moderators NOT contributors on the submission.',
                },
                false: {
                    title: 'Moderators and Contributors',
                    description: 'Comments will be visible to {{provider.name}} moderators AND contributors on the submission.',
                },
            },
        },
        reviewsCommentsAnonymous: {
            title: 'Moderator Comments',
            description: 'If moderators\' comments are visible to contributors, the moderator\'s name can can be displayed or hidden from the contributors.',
            options: {
                true: {
                    title: 'Anonymized Comments',
                    description: 'All comments will be visible to the contributors of the submission, but the moderator\'s name will not be displayed.',
                },
                false: {
                    title: 'Named Comments',
                    description: 'All comments will be visible to the contributors of the submission and the moderator\'s OSF profile name will be displayed.',
                },
            },
        },
    },
    settings: {
        notEditable: 'Moderation settings can only be changed by an OSF administrator. Contact support+{{provider.id}}@osf.io for assistance.',
    },
    setup: {
        start: 'Start Moderating',
        which: 'Which provider would you like to set up first?',
        multipleProviders: 'You\'re an Admin for Multiple Providers',
        chooseSettings: 'Choose moderation settings for {{provider.name}}',
        onceFinalized: 'Once finalized, moderation settings can only be changed by an OSF administrator.',
        finalize: 'Finalize Settings',
        error: {
            message: 'Unable to complete the setup of {{provider.name}}. Please contact support@osf.io.',
            title: 'Something went wrong',
        },
    },
    dashboard: {
        title: 'Reviews Dashboard',
    },
    contactBar: {
        startService: {
            title: 'Want to start a moderated service?',
            paragraph: 'Create your own branded preprint servers backed by the OSF. Check out the open source code and the requirements and road map. Input welcome!',
            button: 'Contact us',
        },
        feedback: {
            title: 'Send us your thoughts',
            paragraph: 'Help us make OSFReviews even better. Let us know your thoughts and comments about our beta version of OSFReviews.',
            button: 'Send feedback',
        },
    },
    application: {
        separator: ' | ',
    },
    content: {
        header: {
            lastEdited: 'Last edited',
        },
        dateLabel: {
            createdOn: 'Created on',
            submittedOn: 'Submitted on',
        },
        share: {
            download: 'Download',
            downloads: 'Downloads',
            downloadFile: 'Download file',
            downloadPreprint: 'Download {{documentType.singular}}',
        },
        seeMore: 'See more',
        seeLess: 'See less',
        version: 'Version',
        preprintDOI: '{{documentType.singularCapitalized}} DOI',
        preprintPendingDOI: 'DOI created after moderator approval',
        preprintPendingDOIMinted: 'DOIs are minted by a third party, and may take up to 24 hours to be registered.',
        articleDOI: 'Peer-reviewed Publication DOI',
        citations: 'Citations',
        disciplines: 'Disciplines',
        projectButton: {
            paragraph: 'The project for this {{documentType.singular}} is available on the OSF.',
            button: 'Visit project',
        },
        warning: {
            header: 'Discard your feedback',
            body: 'Are you sure you want to leave without submitting your feedback? Your feedback will be discarded.',
            footer: {
                leave: 'Leave this page',
                stay: 'Stay on this page',
            },
        },
    },
    components: {
        actionFeed: {
            noActions: 'No recent activity.',
            seeMore: 'See more',
            errorLoading: 'Error fetching more events.',
        },
        actionFeedEntry: {
            actionMessage: {
                submit: 'submitted a {{documentType.singular}} to {{providerName}}',
                accept: 'accepted a {{documentType.singular}} in {{providerName}}',
                reject: 'rejected a {{documentType.singular}} from {{providerName}}',
                edit_comment: 'edited the comment for a {{documentType.singular}} in {{providerName}}',
            },
        },
        dashboardSidebar: {
            providers: 'Providers',
            setUp: 'Set up moderation',
        },
        errorPage: {
            title: {
                notFound: 'Page not found',
                notAuthenticated: 'Not logged in',
                forbidden: 'Forbidden',
                notSetup: 'Moderation not enabled',
            },
            details: {
                notFound: 'The page you were looking for is not found on the OSF Preprints service.',
                notAuthenticated: 'You must be logged in to view this page.',
                forbidden: 'You do not have the permissions to view this page.',
                notSetup: 'An admin needs to set up moderation for this preprint provider.',
            },
            report: 'If this should not have occurred and the issue persists, please report it to',
            goTo: 'Go to OSF Preprints',
        },
        moderationList: {
            newest: 'Newest',
            oldest: 'Oldest',
            pending: 'Pending',
            accepted: 'Accepted',
            rejected: 'Rejected',
            sort: 'Sort',
            noSubmissions: 'No submissions.',
        },
        moderationListRow: {
            submission: {
                submittedOn: 'Submitted on {{timeDate}} by',
                submitted: 'Submitted {{timeDate}} by',
                acceptedOn: 'Accepted on {{timeDate}} by {{moderatorName}}',
                accepted: 'Accepted {{timeDate}} by {{moderatorName}}',
                acceptedAutomaticallyOn: 'Accepted automatically on {{timeDate}}',
                acceptedAutomatically: 'Accepted automatically {{timeDate}}',
                rejectedOn: 'Rejected on {{timeDate}} by {{moderatorName}}',
                rejected: 'Rejected {{timeDate}} by {{moderatorName}}',
            },
        },
        notificationList: {
            heading: 'Configure reviews notification preferences',
            helperText: 'To configure other notification preferences visit your',
            userSettings: 'user settings',
        },
        notificationListRow: {
            instant: 'Instant',
            daily: 'Daily',
            never: 'Never',
            errorUpdating: 'Error updating notification settings.',
        },
        moderatorListAdd: {
            inviteText: 'invite by email',
            userSearchError: 'Error searching users.',
        },
        moderatorList: {
            editDisabledMessage: 'Can only edit one moderator at a time',
            adminDisabledMessage: 'Must have one admin',
        },
        preprintStatusBanner: {
            recentActivity: {
                pending: 'submitted this {{documentType.singular}} on',
                accepted: 'accepted this {{documentType.singular}} on',
                rejected: 'rejected this {{documentType.singular}} on',
                automatic: {
                    pending: 'This {{documentType.singular}} was submitted on',
                    accepted: 'This {{documentType.singular}} was automatically accepted on',
                },
            },
            message: {
                pendingPre: 'not publicly available or searchable until approved by a moderator',
                pendingPost: 'publicly available and searchable but is subject to removal by a moderator',
                accepted: 'publicly available and searchable',
                rejected: 'not publicly available or searchable',
            },
            pending: 'pending',
            accepted: 'accepted',
            rejected: 'rejected',
            loading: 'Loading...',
            decision: {
                makeDecision: 'Make decision',
                modifyDecision: 'Modify decision',
                header: {
                    submitDecision: 'Submit your decision',
                    modifyDecision: 'Modify your decision',
                },
                moderator: 'Moderator',
                base: 'This {{documentType.singular}} is',
                btn: {
                    submitDecision: 'Submit decision',
                    modifyDecision: 'Modify decision',
                    update_comment: 'Update comment',
                },
                commentPlaceholder: 'Explain the reasoning behind your decision (optional)',
                commentLengthError: 'Comment is {{difference}} character(s) too long (maximum is {{limit}}).',
                accept: {
                    label: 'Accept',
                    pre: 'Submission will appear in search results and be made public.',
                    post: 'Submission will continue to appear in search results.',
                },
                reject: {
                    label: 'Reject',
                    pre: 'Submission will not appear in search results and will remain private.',
                    post: 'Submission will be removed from search results and made private.',
                },
            },
            settings: {
                comments: {
                    private: 'Comments are not visible to contributors',
                    public: 'Comments are visible to contributors on decision',
                },
                names: {
                    anonymous: 'Comments are anonymous',
                    named: 'Commenter\'s name is visible to contributors',
                },
                moderation: {
                    pre: 'Submission appears in search results once accepted',
                    post: 'Submission will be removed from search results and made private if rejected',
                },
            },
            error: 'Error submitting decision.',
        },
        unregisteredContributorForm: {
            fullNameLabel: 'Full name',
            emailLabel: 'Email',
            notifyMessage: 'We will notify the user that they have been added as a moderator.',
        },
    },
};
