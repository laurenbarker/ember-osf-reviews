export default {
    global: {
        cancel: 'Cancel',
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
    providerSettings: {
        reviewsWorkflow: {
            title: 'Moderation Type',
            description: '',
            options: {
                'pre-moderation': {
                    title: 'Pre-moderation',
                    description: 'All {{provider.type.plural}} are placed in a queue for a moderator to accept or reject. {{provider.type.pluralCapitalized}} are displayed publicly only after approval.',
                },
                'post-moderation': {
                    title: 'Post-moderation',
                    description: 'All {{provider.type.plural}} are displayed publicly immediately upon submission. {{provider.type.pluralCapitalized}} also appear in a queue for a moderator to accept or reject. If rejected, the {{provider.type.singular}} is no longer displayed publicly.',
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
            downloadPreprint: 'Download {{provider.type.singular}}',
        },
        seeMore: 'See more',
        seeLess: 'See less',
        version: 'Version',
        preprintDOI: '{{provider.type.singularCapitalized}} DOI',
        preprintPendingDOI: 'DOI created after moderator approval',
        articleDOI: 'Peer-reviewed Publication DOI',
        citations: 'Citations',
        disciplines: 'Disciplines',
        projectButton: {
            paragraph: 'The project for this paper is available on the OSF.',
            button: 'Visit project',
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
                submit: 'submitted a {{documentType}} to {{providerName}}',
                accept: 'accepted a {{documentType}} in {{providerName}}',
                reject: 'rejected a {{documentType}} from {{providerName}}',
                edit_comment: 'edited the comment for a {{documentType}} in {{providerName}}',
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
                submittedOn: 'submitted on {{timeDate}} by',
                submitted: 'submitted {{timeDate}} by',
                acceptedOn: 'accepted on {{timeDate}} by {{moderatorName}}',
                accepted: 'accepted {{timeDate}} by {{moderatorName}}',
                acceptedAutomaticallyOn: 'accepted automatically on {{timeDate}}',
                acceptedAutomatically: 'accepted automatically {{timeDate}}',
                rejectedOn: 'rejected on {{timeDate}} by {{moderatorName}}',
                rejected: 'rejected {{timeDate}} by {{moderatorName}}',
            },
        },
        preprintStatusBanner: {
            recentActivity: {
                pending: 'submitted this {{provider.type.singular}} on',
                accepted: 'accepted this {{provider.type.singular}} on',
                rejected: 'rejected this {{provider.type.singular}} on',
                automatic: {
                    pending: 'This {{provider.type.singular}} was submitted on',
                    accepted: 'This {{provider.type.singular}} was automatically accepted on',
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
                base: 'This {{provider.type.singular}} is',
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
    },
};
