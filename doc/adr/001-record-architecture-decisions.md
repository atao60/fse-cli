# 000. Record architecture decisions

Date: 2020-10-20

## Status

Accepted

## Context

Much documentation can be replaced with highly readable code and tests. In a world of evolutionary architecture, however, it's important to record certain design decisions for the benefit of future team members as well as for external oversight. Architecture Decision Records is a way for capturing important architectural decisions along with their context and consequences. 

## Decision

Lightweight Architecture Decision Records will be used.

Create a folder `doc/adr` under the project root. 

Create a file for each ADR:
- with file name syntax: `<log number>-<short name>.md`,
- using markdown as content format syntax.

The content of an ADR can have the following sections:

- Title — Title of the decision record, i.e. `<log number>. <full name>`

- Status — Status can be proposed, accepted or superseded. If you make any decisions and you need to change them later, 
 you can simply add a new record with the changed status.

- Context — What is the context of this decision? It is important to capture the full context of the decision so that the reader knows the reasons behind it.

- Decision — The decision that was made. For instance, use Elasticsearch for an enterprise-wide search API.

- Consequences — In this section, you can add what would happen if this decision is made. It is important to list all consequences, both positive and negative.

- Any other relevant section (references, experience report, ...)

A template is available [here](xxx-adr-template.md).

Josef Blake's article can provide some help on when to create an ADR, see link below.

## Consequences

LADR is a technique of storing these details in source control, instead of a wiki or website, as then they can provide a record that remains in sync with the code itself.

Being plain text files, LADRs can be created by hand and edited in any text editor.

Using markdown syntax:
- decisions can be read in the terminal,
- decisions will be formatted nicely and hyperlinked by the browsers of project hosting sites like GitHub and Bitbucket.

## More reading

[Lightweight Architecture Decision Records](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)

[A Simple but Powerful Tool to Record Your Architectural Decisions](https://medium.com/better-programming/here-is-a-simple-yet-powerful-tool-to-record-your-architectural-decisions-5fb31367a7da), Tanmay Deshpande, May 20, 2018

[When Should I Write an Architecture Decision Record](https://engineering.atspotify.com/2020/04/14/when-should-i-write-an-architecture-decision-record/), April 14, 2020 Published by Josef Blake

[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard - November 15, 2011

[Markdown format](https://daringfireball.net/projects/markdown/)